// models/Chat.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class TwoFactor extends Model {}

TwoFactor.init({
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pinCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'TwoFactor',
});

module.exports = TwoFactor;
