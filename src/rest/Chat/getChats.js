const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");
const authMiddleware = require('../../middlewares/auth-middleware');

router.get('/storage/chats', authMiddleware, async (req, res) => {
    const userId = req.user?.id;

    try {
        const chats = await Chat.findAll({
            where: { ownerChatId: userId },
            attributes: ['chatId', 'chatTitle'],
            order: [['createdAt', 'DESC']]
        });

        if (chats.length <= 0){
            return res.status(404).json({ success: false });
        }

        return res.status(200).json({ success: true, chats });
    } catch (e) {
        console.error("Error fetching chats:", e);
        return res.status(503).json({ success: false, message: 'Server error, please try again later' });
    }
});

module.exports = router;
