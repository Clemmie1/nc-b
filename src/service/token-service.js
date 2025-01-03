const jwt = require('jsonwebtoken');
const tokenModel = require('../models/Token');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '7d' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '1y' });
        return {
            accessToken,
            refreshToken
        };
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({where: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({ userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.destroy({ where: { refreshToken: refreshToken } })
        return tokenData;
    }

    async findToken(refreshToken) {
        return tokenModel.findOne({ where: { refreshToken: refreshToken } });
    }
}

module.exports = new TokenService();
