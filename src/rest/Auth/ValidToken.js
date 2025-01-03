const express = require("express");
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

// Route for creating a new chat
router.get('/auth/check', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is missing' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});

module.exports = router;
