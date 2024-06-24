const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const Skills = db.define('skills', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
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

module.exports = Skills;
