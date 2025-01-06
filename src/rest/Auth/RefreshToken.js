const express = require("express");
const router = express.Router();
const tokenService = require('../../service/token-service')

router.get('/auth/refresh', async (req, res) => {
    

    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        
        if (!userData) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const tokenInDb = await tokenService.findToken(refreshToken);
        if (!tokenInDb) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        const payload = { id: userData.id, email: userData.email };
        const tokens = tokenService.generateTokens(payload);

        await tokenService.saveToken(userData.id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
        });

        res.json(tokens);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
