const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");
const ChatContent = require("../../models/ChatContent");
const authMiddleware = require('../../middlewares/auth-middleware');

router.delete('/storage/deleteChat', authMiddleware, async (req, res) => {
    const { chatId } = req.body;

    if (!chatId) {
        return res.status(400).json({ success: false, message: 'Chat ID is missing' });
    }

    const userId = req.user?.id;

    try {
        const chat = await Chat.findOne({ where: { chatId: chatId, ownerChatId: userId }, limit: 1 });

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found or you are not the owner' });
        }

        await ChatContent.update(
            { deletedAt: new Date() },
            { where: { chatId: chatId } }
        );

        await Chat.destroy({ where: { chatId: chatId, ownerChatId: userId } });

        return res.status(200).json({ success: true});

    } catch (e) {
        console.error("Error deleting chat:", e);
        return res.status(503).json({ success: false, message: 'Server error, please try again later' });
    }
});

module.exports = router;
