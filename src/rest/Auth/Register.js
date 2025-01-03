const express = require("express");
const User = require("../../models/User");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require("uuid");
const router = express.Router();


router.post("/auth/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "email and password is required!" });
    }

    try {
        const alreadyExistsUser = await User.findOne({ where: { email } });

        if (alreadyExistsUser) {
            return res.status(200).json({
                success: false,
                message: 'Пользователь уже существует'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const identity = `idcs_${uuidv4()}`;
        const newUser = await User.create({ email, password: hashedPassword, idcs: identity});

        res.status(200).json({
            success: true,
            message: 'Спасибо за регистрацию'
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Невозможно зарегистрировать пользователя в данный момент' });
    }

    /*const alreadyExistsUser = await User.findOne({ where: { email } }).catch(
        (err) => {
            console.log("Error: ", err);
        }
    );

    if (alreadyExistsUser) {
        return res.status(409).json({ message: "User with email already exists!" });
    }

    const newUser = new User({ email, password });
    const savedUser = await newUser.save().catch((err) => {
        res.status(500).json({ error: "Cannot register user at the moment!" });
    });

    if (savedUser) res.json({ message: "Thanks for registering" });*/
});

module.exports = router;