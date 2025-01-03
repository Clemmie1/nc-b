const { Sequelize } = require('sequelize');

// Настройки подключения к базе данных MySQL
// const sequelize = new Sequelize('mysql://u295372637_neuronchat:@Xperikss1233@193.203.168.60:3306/u295372637_neuronchat');
const sequelize = new Sequelize('u295372637_neuronchat', 'u295372637_neuronchat', '@Xperikss1233', {
    host: '193.203.168.60',
    port: 3306,
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => {
        console.log('[NeuronChat] Connection has been established successfully.');
    })
    .catch(err => {
        console.error('[NeuronChat] Unable to connect to the database:', err);
    });

module.exports = sequelize;