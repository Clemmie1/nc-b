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

const JWT_SECRET = 'your_jwt_secret_key'; // Use a more secure key in production

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Требуется адрес электронной почты и пароль' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
        }

        // Проверка двухфакторной аутентификации
        if (user.twoFactorEnabled) {

            // Генерация и сохранение токена 2FA
            const token = uuidv4();
            const pinCode = Math.floor(100000 + Math.random() * 900000); // Генерация 6-значного кода
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут
            // const expiresAt = new Date(Date.now() + 15 * 1000); //10 sec

            await TwoFactor.create({ token, email, pinCode, expiresAt });

            const clientIp = requestIp.getClientIp(req);
            const agent = useragent.parse(req.headers['user-agent']);
            const deviceName = `${agent.device.toString()} ${agent.os.toString()}`;

            // Отправка PIN-кода (например, через email)
            console.log(`Отправлен PIN-код: ${pinCode}`); // Замените на логику отправки email

            setImmediate(async () => {
                try {
                    await sendEmail(
                        email,
                        `[NeuronChat] Пожалуйста, подтвердите свое устройство`,
                        'LoginTwoFactor',
                        {
                            pinCode: `${pinCode}`,
                            ip: clientIp || 'IP не определён',
                            device: deviceName || 'Устройство не определено',
                        }
                    );
                    console.log('Email отправлен успешно');
                } catch (err) {
                    console.error('Ошибка при отправке email:', err);
                }
            });

            res.status(200).json({
                success: true,
                type: "2FA",
                token, // Передаем токен клиенту
            });
        }

        const payload = { id: user.id, email: user.email }
        const token = tokenService.generateTokens(payload)
        await tokenService.saveToken(user.id, token.refreshToken);
        // Генерация токена для входа
        // const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            type: "Login",
            token,
        });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Невозможно войти в систему в данный момент' });
    }
});

module.exports = router;
