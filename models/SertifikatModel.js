const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const Sertifikat = db.define('sertifikat', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    perusahaan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tanggal_kegiatan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bagian: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link_icon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nama_icon: {
        type: DataTypes.STRING,
        allowNull: true,
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

module.exports = Sertifikat;
