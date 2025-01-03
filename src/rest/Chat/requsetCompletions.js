const express = require("express");
const path = require('path');
const router = express.Router();
const { Readable } = require('stream');
const authMiddleware = require('../../middlewares/auth-middleware');
const common = require('oci-common');
const fetch = require('node-fetch');
const fs = require("fs");

const keyPath = path.join('src', 'oci', 'key.pem');
const privateKey = fs.readFileSync(keyPath, 'utf-8');
const provider = new common.SimpleAuthenticationDetailsProvider(
    'ocid1.tenancy.oc1..aaaaaaaarl4drcdtvt6a47raikrf7vcl3x6v5d4ae4gmw2zz6su4es2z3una',
    'ocid1.user.oc1..aaaaaaaaqelbhngof23gp265jbdawndxmzs6ptgugc2ftcknjucohznolm6q',
    'ef:dc:42:07:68:d0:18:2b:94:a2:f5:e7:d4:81:03:88',
    privateKey,
    null,
    'ap-sydney-1'
);

router.post('/chat/completions', authMiddleware, async (req, res) => {
    const { chatHistory, message } = req.body;

    const userId = req.user?.id;

    const endpoint =
        'https://inference.generativeai.eu-frankfurt-1.oci.oraclecloud.com/20231130/actions/chat';
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    const signer = new common.DefaultRequestSigner(provider);
    const now = new Date();
    const options = {
        weekday: 'long',    // Полное название дня недели
        year: 'numeric',    // Год в числовом формате
        month: 'long',      // Полное название месяца
        day: 'numeric',     // Число месяца
        hour: 'numeric',    // Часы
        minute: 'numeric',  // Минуты
        second: undefined,  // Секунды исключаем
        timeZone: 'Europe/Moscow', // Устанавливаем московское время
        timeZoneName: 'short' // Короткое название часового пояса
    };
    const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(now);
    const body = JSON.stringify({
        "compartmentId": "ocid1.tenancy.oc1..aaaaaaaarl4drcdtvt6a47raikrf7vcl3x6v5d4ae4gmw2zz6su4es2z3una",
        "servingMode": {
            "modelId": "cohere.command-r-08-2024",
            "servingType": "ON_DEMAND"
        },
        "chatRequest": {
            "maxTokens": 1000,
            "temperature": 0.4,
            "preambleOverride": `You are Command, a brilliant, sophisticated, AI-assistant chatbot trained to assist human users by providing thorough responses. You are powered by Command, a large language model built by the company Neuron Chat. Today's date is ${formattedDate}`,
            "frequencyPenalty": 1,
            "presencePenalty": 0,
            "topP": 1,
            "topK": 0,
            "isStream": true,
            chatHistory,
            message,
            "apiFormat": "COHERE"
        }
    });



    const httpRequest = {
        uri: endpoint,
        headers: headers,
        method: 'POST',
        body: body,
    };

    await signer.signHttpRequest(httpRequest);

    try {
        const response = await fetch(httpRequest.uri, {
            method: httpRequest.method,
            headers: httpRequest.headers,
            body: httpRequest.body,
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to get response from API' });
        }

        // Обрабатываем поток
        response.body.on('data', chunk => {
            // Потоковые данные, отправляем их клиенту
            res.write(chunk);
        });

        response.body.on('end', () => {
            // Завершаем поток
            res.end();
        });

        response.body.on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).json({ error: 'Stream error' });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;