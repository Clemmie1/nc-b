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

let totalR = 0;

router.post('/chat/generate_autocompletions', async (req, res) => {

    totalR += 1;
    console.log(totalR);

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
            "maxTokens": 2024,
            "temperature": 0.4,
            "frequencyPenalty": 1,
            "presencePenalty": 0,
            "topP": 1,
            "topK": 0,
            "promptTruncation": "OFF",
            "isStream": false,
            chatHistory: [],
            message: "Привет",
            "apiFormat": "COHERE",
            // responseFormat: {
            //    type: "TEXT" 
            // },
            // "tools": [
            //     {
            //         "name": "internet_search"
            //     }
            // ]

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


        const data = await response.json();
        return res.json(data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;