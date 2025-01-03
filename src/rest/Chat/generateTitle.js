const express = require("express");
const router = express.Router();
const authMiddleware = require('../../middlewares/auth-middleware');
const path = require("path");
const fs = require("fs");
const common = require("oci-common");
const fetch = require("node-fetch");

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

router.post('/chat/generate-title', async (req, res) => {
    const { chatId, input } = req.body;

    if (!chatId) {
        return res.status(400).json({ success: false, message: 'Chat ID is missing' });
    }

    if (!input) {
        return res.status(400).json({ success: false, message: 'input is missing' });
    }

    // const userId = req.user?.id;


    try {
        const response = await fetch("https://api.cloudflare.com/client/v4/accounts/391c185c2008cfc629bb5cc96bb1a0a3/ai/run/@cf/facebook/bart-large-cnn", {
            method: 'POST',  // Используем GET метод
            body: JSON.stringify({
                input_text: input,
                max_length: 14
            }),
            headers: {
                'Authorization': 'Bearer ozUNzsppK5TVpOA2L6TYuLgmhRMFX88MDBbGct49', // Authorization header
                'Content-Type': 'application/json'  // Content-Type header
            }
        });

        const data = await response.json();
        return res.json(data);
    } catch (e) {

    }

});

module.exports = router;

