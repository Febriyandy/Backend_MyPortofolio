const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const Artikel = db.define('artikel', {
    judul: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    tanggal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isi: {
        type: DataTypes.JSON(DataTypes.TEXT),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    kategori: {
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

module.exports = Artikel;
