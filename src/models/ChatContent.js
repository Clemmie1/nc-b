// models/ChatContent.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Подключение к базе данных
const Chat = require('./Chat'); // Модель чата

class ChatContent extends Model {}

ChatContent.init({
    chatId: {
        type: DataTypes.STRING,
        references: {
            model: Chat,
            key: 'chatId',
        },
        allowNull: false,
    },
    ownerChatId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chatHistory: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    deletedAt: {  // Added soft delete field
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'ChatContent',
    paranoid: true,  // Enable soft delete functionality
});

ChatContent.belongsTo(Chat, { foreignKey: 'chatId', onDelete: 'CASCADE' }); // Связь с чатом

module.exports = ChatContent;
