const express = require('express');
const crypto = require('crypto');
const User = require('../../models/User');
const PasswordResetToken = require('../../models/PasswordResetToken');
const { sendEmail } = require('../../emailService');
const requestIp = require("request-ip");
const useragent = require("useragent");
const router = express.Router();

router.post('/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Требуется email' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь с таким email не найден' });
        }

        // Генерация токена
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // Токен действует 1 час

        // Сохранение токена в базе
        await PasswordResetToken.create({ email, token, expiresAt });

        // Отправка email
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
        const clientIp = requestIp.getClientIp(req);
        const agent = useragent.parse(req.headers['user-agent']);
        const deviceName = `${agent.device.toString()} ${agent.os.toString()}`;
        setImmediate(async () => {
            try {
                await sendEmail(
                    email,
                    `[NeuronChat] Сброс пароля`,
                    'ForgotPassword',
                    {
                        resetLink: `${resetLink}`,
                        ip: clientIp || 'IP не определён',
                        device: deviceName || 'Устройство не определено',
                    }
                );
                console.log('Email отправлен успешно');
            } catch (err) {
                console.error('Ошибка при отправке email:', err);
            }
        });
        res.status(200).json({ success: true, message: 'Ссылка для сброса пароля отправлена на email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

module.exports = router;

