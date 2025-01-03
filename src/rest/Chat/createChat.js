const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");
const ChatContent = require("../../models/ChatContent");
const authMiddleware = require('../../middlewares/auth-middleware');

router.post('/storage/createChat', authMiddleware, async (req, res) => {
    const { chatId, input } = req.body;

    if (!chatId) {
        return res.status(400).json({ success: false, message: 'chat id is missing' });
    }

    if (!input) {
        return res.status(400).json({ success: false, message: 'input is missing' });
    }

    const userId = req.user?.id;
    try {

        const chatCount = await Chat.count({ where: { ownerChatId: userId } });

        if (chatCount >= 3) {
            return res.status(200).json({
                success: false,
                message: "Недостаточно памяти для нового чата. "
            });
        }

        let chat = await Chat.findOne({ where: { chatId: chatId, ownerChatId: userId } });

        if (chat) {
            return res.status(409).json({ success: false });
        }

        await Chat.create({
            chatId: chatId,
            chatTitle: "Новый чат",
            ownerChatId: userId,
            // chat_content: messages || []
        });
        await ChatContent.create({
            chatId: chatId,
            ownerChatId: userId,
            chatHistory: JSON.stringify([{
                role: "USER",
                message: input
            }])
        })
        return res.status(200).json({ success: true });
    } catch (e) {
        console.error("Error creating chat:", e);
        return res.status(503).json({ success: false, message: 'Server error, please try again later' });
    }
});

module.exports = router;
