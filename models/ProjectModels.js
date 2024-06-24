const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const Project = db.define('project', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bahasa_pemrograman: {
        type: DataTypes.JSON(DataTypes.TEXT),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    link_github: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    link_preview: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link_foto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nama_foto: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true
});

module.exports = Project;
