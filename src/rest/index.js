const express = require("express");

const refreshToken = require("./Auth/RefreshToken")
const userLogout = require("./Auth/Logout")
const userLogin = require("./Auth/Login")
const userRegister = require("./Auth/Register");
const userLoginTwoFactor = require("./Auth/LoginTwoFactor");
const userLoginResendTwoFactor = require("./Auth/LoginResendTwoFactor");
const userForgotPassword = require("./Auth/PasswordReset");


const testChatCompletions = require("./Chat/testRequsetCompletions");
const chatCompletions = require("./Chat/requsetCompletions");
const createChat = require("./Chat/createChat");
const getChats = require("./Chat/getChats");
const deleteChats = require("./Chat/deleteChat");
const getConversationsChat = require("./Chat/getConversationsChat");
const updateConversationsChat = require("./Chat/updateConversationsChat");
const generateText = require("./Chat/generateTitle");
const renameChat = require("./Chat/renameChat");
const generateAutoCompletions = require("./Chat/generateAutoCompletions");

const router = express.Router();

router.use(refreshToken);
router.use(userLogout);
router.use(userLogin);
router.use(userRegister);
router.use(userLoginTwoFactor);
router.use(userLoginResendTwoFactor);
router.use(userForgotPassword);


router.use(testChatCompletions);
router.use(chatCompletions);
router.use(createChat);
router.use(getChats);
router.use(deleteChats);
router.use(getConversationsChat);
router.use(updateConversationsChat);
// router.use(generateText);
router.use(renameChat);
router.use(generateAutoCompletions);

module.exports = router;