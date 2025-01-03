// models/User.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Подключение к базе данных

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idcs: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    premium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    expirePremium: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'User',
});

module.exports = User;
