const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Goods = sequelize.define('Goods', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    // Додайте інші поля за необхідністю
}, {
    tableName: 'goods', // Назва таблиці в базі даних
    timestamps: false,   // Вимкнення автоматичних полів created_at і updated_at
});

module.exports = Goods;
