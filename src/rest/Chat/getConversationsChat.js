const express = require("express");
const router = express.Router();
const ChatContent = require("../../models/ChatContent");
const authMiddleware = require('../../middlewares/auth-middleware');

router.post('/chat/conversations', authMiddleware, async (req, res) => {
    const { chatId } = req.body;

    if (!chatId) {
        return res.status(400).json({ message: 'Требуется адрес chatId' });
    }

    const userId = req.user?.id;

    try {
        const chatsContent = await ChatContent.findOne({
            where: { ownerChatId: userId, chatId: chatId }, limit: 1
        });

        if (!chatsContent) {
            return res.status(404).json({ success: false });
        }

        let chatHistory;
        try {
            chatHistory = JSON.parse(chatsContent.chatHistory);
        } catch (parseError) {
            console.error("Error parsing chatHistory:", parseError);
            return res.status(400).json({ success: false, message: 'Invalid JSON format in chatHistory' });
        }

        return res.status(200).json({
            success: true,
            data: {
                chatId: chatId,
                createdAt: chatsContent.createdAt,
                chatHistory: chatHistory,
            },
        });
    } catch (e) {
        console.error("Error fetching chats:", e);
        return res.status(503).json({ success: false, message: 'Server error, please try again later' });
    }
});

module.exports = router;
