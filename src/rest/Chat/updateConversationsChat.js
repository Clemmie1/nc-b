const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");
const ChatContent = require("../../models/ChatContent");
const authMiddleware = require('../../middlewares/auth-middleware');

router.put('/chat/updateConversations', authMiddleware, async (req, res) => {
    const { chatId, chatHistory } = req.body;

    if (!chatId) {
        return res.status(400).json({ message: 'Требуется адрес chatId' });
    }

    if (!chatHistory) {
        return res.status(400).json({ message: 'Требуется адрес chatHistory' });
    }

    const userId = req.user?.id;

    try {
        const chatsContent = await ChatContent.findOne({
            where: { ownerChatId: userId, chatId: chatId }, limit: 1
        });

        if (!chatsContent) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        await chatsContent.update({
            chatHistory: JSON.stringify(chatHistory)
        });

        return res.status(200).json({
            success: true
        });

    } catch (e) {
        console.error("Error fetching chats:", e);
        return res.status(503).json({ success: false, message: 'Server error, please try again later' });
    }
});

module.exports = router;
