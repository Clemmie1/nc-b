// models/Chat.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Подключение к базе данных
const User = require('./User'); // Модель пользователя

class Chat extends Model {}

Chat.init({
    chatId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    chatTitle: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ownerChatId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Chat',
});

Chat.belongsTo(User, { foreignKey: 'ownerChatId' });

module.exports = Chat;