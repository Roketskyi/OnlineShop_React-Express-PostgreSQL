const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Base = sequelize.define('base', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  admin: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
    tableName: 'base',
    timestamps: false
});

module.exports = { Base };
