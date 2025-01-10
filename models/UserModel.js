const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const Users = db.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    title_role: {
        type: DataTypes.STRING,
    },
    deskripsi: {
        type: DataTypes.STRING,
    },
    url_photo: {
        type: DataTypes.STRING,
    },
    nama_photo: {
        type: DataTypes.STRING,
    },
    url_photo_contact: {
        type: DataTypes.STRING,
    },
    nama_photo_contact: {
        type: DataTypes.STRING,
    },
    title_about: {
        type: DataTypes.STRING,
    },
    deksripsi_about1: {
        type: DataTypes.STRING,
    },
    deksripsi_about2: {
        type: DataTypes.STRING,
    },
    url_email: {
        type: DataTypes.STRING,
    },
    url_ig: {
        type: DataTypes.STRING,
    },
    url_github: {
        type: DataTypes.STRING,
    },
    url_x: {
        type: DataTypes.STRING,
    },
    url_linkedin: {
        type: DataTypes.STRING,
    },
    url_tiktok: {
        type: DataTypes.STRING,
    },
    url_fb: {
        type: DataTypes.STRING,
    },
    url_discord: {
        type: DataTypes.STRING,
    },
    copyright: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    refresh_token: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
});

module.exports = Users;
