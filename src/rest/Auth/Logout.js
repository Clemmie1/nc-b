const express = require("express");
const User = require("../../models/User");
const TwoFactor = require("../../models/TwoFactor");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../../emailService');
const requestIp = require('request-ip');
const useragent = require('useragent');
const tokenService = require('../../service/token-service')
const authMiddleware = require('../../middlewares/auth-middleware');


router.post('/auth/logout', authMiddleware, async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        await tokenService.removeToken(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logged out' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
