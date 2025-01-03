const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Подключение к базе данных
const User = require('./User'); // Модель пользователя

class Token extends Model {}

Token.init({
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Token',
})

Token.belongsTo(User, { foreignKey: 'userId' });

module.exports = Token;