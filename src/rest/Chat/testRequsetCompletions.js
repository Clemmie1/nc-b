const express = require("express");
const path = require('path');
const router = express.Router();
const { Readable } = require('stream');
const Chat = require("../../models/Chat");
const authMiddleware = require('../../middlewares/auth-middleware');
const common = require('oci-common');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const User = require("../../models/User");
const fs = require("fs");
const JWT_SECRET = 'your_jwt_secret_key';

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

router.post('/test/chat/completions', async (req, res) => {
    // const token = req.headers['authorization']?.split(' ')[1];
    const { messages } = req.body;
    const endpoint =
        'https://inference.generativeai.eu-frankfurt-1.oci.oraclecloud.com/20231130/actions/chat';
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    const signer = new common.DefaultRequestSigner(provider);
    const body = JSON.stringify({
        "compartmentId": "ocid1.tenancy.oc1..aaaaaaaarl4drcdtvt6a47raikrf7vcl3x6v5d4ae4gmw2zz6su4es2z3una",
        "servingMode": {
            "modelId": "cohere.command-r-08-2024",
            "servingType": "ON_DEMAND"
        },
        "chatRequest": {
            "maxTokens": 600,
            "temperature": 1,
            "preambleOverride": "",
            "frequencyPenalty": 0,
            "presencePenalty": 0,
            "topP": 0.75,
            "topK": 0,
            "isStream": true,
            "chatHistory": [],
            "message": "привет",
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
    console.log("\n\n\n\n"+body)

    try {
        const response = await fetch(httpRequest.uri, {
            method: httpRequest.method,
            headers: httpRequest.headers,
            body: httpRequest.body,
        });

        // if (!response.ok) {
        //     return res.status(response.status).json({ error: 'Failed to get response from API' });
        // }
        response.body.on('data',chunk => {
            // Потоковые данные, отправляем их клиенту
            res.write(chunk);
        });

        response.body.on('end', () => {
            // Завершаем поток
            res.end();
        });
        // const data = await response.json(); // Или response.text() в зависимости от типа данных
        // return res.json(data); // Отправляем данные в от
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;