// app.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const errorMiddleware = require('./middlewares/error-middleware');
const sequelize = require('./database'); // Подключение к базе данных

require("dotenv").config();
// Синхронизация моделей с базой данных
sequelize.sync({ force: false })
    .then(() => console.log('[NeuronChat] Database synced!'))
    .catch(err => console.log(err));
// Подключаем модели

const api = require("./rest");
const app = express();

// Настройка CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

// Настройка заголовков безопасности
app.use(helmet());

// Главная страница
app.get("/", async (req, res) => {
    res.json({ ver: "v1" });
});

// Подключение маршрутов API
app.use("/v1", api);
app.use(errorMiddleware);

module.exports = app;
