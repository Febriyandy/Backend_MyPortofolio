const { Sequelize } = require("sequelize");

const db = new Sequelize('feby1739_db_portofolio', 'feby1739_admin', '@Febriyandy23', {
    host: "febriyandy.xyz",
    port: "3306",
    dialect: "mysql"
});

module.exports = db;
