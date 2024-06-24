const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const Kontak = db.define('kontak',{
    nama:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isEmail: true
        }
    },
    no_hp:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    perusahaan:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    pesan:{
        type: DataTypes.TEXT,
        allowNull: true,
    },
},{
    freezeTableName: true
});

module.exports = Kontak;