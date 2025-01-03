const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class PasswordResetToken extends Model {}

PasswordResetToken.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'PasswordResetToken',
});

module.exports = PasswordResetToken;
