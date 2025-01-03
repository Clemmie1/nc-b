const express = require("express");
const TwoFactor = require("../../models/TwoFactor");
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { sendEmail } = require('../../emailService');
const requestIp = require("request-ip");
const useragent = require("useragent");

router.post('/auth/resend-2fa', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Требуется token' });
    }

    try {
        const twoFactorEntry = await TwoFactor.findOne({ where: { token } });

        if (!twoFactorEntry) {
            return res.status(400).json({ success: false, message: 'Токен не найден или устарел' });
        }

        if (twoFactorEntry.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: 'Токен устарел, необходимо выполнить вход заново' });
        }

        // Генерация нового PIN-кода
        const newPinCode = Math.floor(100000 + Math.random() * 900000); // Генерация 6-значного кода
        const newExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Новое время истечения (5 минут)

        // Обновление записи в базе данных
        twoFactorEntry.pinCode = newPinCode;
        twoFactorEntry.expiresAt = newExpiresAt;
        await twoFactorEntry.save();

        const clientIp = requestIp.getClientIp(req);
        const agent = useragent.parse(req.headers['user-agent']);
        const deviceName = `${agent.device.toString()} ${agent.os.toString()}`;
        // Логика отправки нового PIN-кода (например, email)
        console.log(`Повторно отправлен PIN-код: ${newPinCode}`); // Замените на реальную отправку email

        setImmediate(async () => {
            try {
                await sendEmail(
                    twoFactorEntry.email,
                    `[NeuronChat] Пожалуйста, подтвердите свое устройство`,
                    'LoginTwoFactor',
                    {
                        pinCode: `${newPinCode}`,
                        ip: clientIp || 'IP не определён',
                        device: deviceName || 'Устройство не определено',
                    }
                );
                console.log('Email отправлен успешно');
            } catch (err) {
                console.error('Ошибка при отправке email:', err);
            }
        });

        res.status(200).json({ success: true, message: 'PIN-код отправлен повторно' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Ошибка при повторной отправке PIN-кода' });
    }
});

module.exports = router;
