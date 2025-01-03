const express = require("express");
const router = express.Router();
const ChatContent = require("../../models/ChatContent");
const authMiddleware = require('../../middlewares/auth-middleware');
const Chat = require("../../models/Chat");

router.put('/chat/rename', authMiddleware, async (req, res) => {
    const { chatId, newName } = req.body;

    if (!chatId) {
        return res.status(400).json({ success: false, message: 'Chat ID is missing' });
    }

    if (!newName) {
        return res.status(400).json({ success: false, message: 'newName is missing' });
    }

    const userId = req.user?.id;

    try {
        const chat = await Chat.findOne({ where: { chatId: chatId, ownerChatId: userId }, limit: 1 });

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found or you are not the owner' });
        }

        await Chat.update(
            { chatTitle: newName },
            { where: { chatId: chatId, ownerChatId: userId } }
        );

        return res.status(200).json({
            success: true
        });
    } catch (e) {
        console.error("Error fetching chats:", e);
        return res.status(503).json({ success: false, message: 'Server error, please try again later' });
    }
});

module.exports = router;
