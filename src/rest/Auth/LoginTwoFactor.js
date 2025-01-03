const express = require("express");
const TwoFactor = require("../../models/TwoFactor");
const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const router = express.Router();
const tokenService = require('../../service/token-service')


router.post('/auth/verify-2fa', async (req, res) => {
    const { pinCode, token } = req.body;

    if (!pinCode || !token) {
        return res.status(400).json({ success: false, message: 'Требуются pinCode и token' });
    }

    try {
        const twoFactorEntry = await TwoFactor.findOne({ where: { token } });

        if (!twoFactorEntry) {
            return res.status(400).json({ success: false, message: 'Токен не найден или устарел' });
        }

        if (twoFactorEntry.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: 'Токен устарел' });
        }

        if (twoFactorEntry.pinCode !== pinCode) {
            return res.status(401).json({ success: false, message: 'Неверный PIN-код' });
        }

        const user = await User.findOne({ where: { email: twoFactorEntry.email } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }

        const payload = { id: user.id, email: user.email }
        const tokenJWT = tokenService.generateTokens(payload)

        // Удаляем запись из базы данных после успешной проверки
        await TwoFactor.destroy({ where: { token } });

        res.status(200).json({
            success: true,
            tokenJWT
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Ошибка проверки 2FA' });
    }
});

module.exports = router;