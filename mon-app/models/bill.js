// models/bill.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bill = sequelize.define('Bill', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  bill_name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('unpaid', 'paid'), defaultValue: 'unpaid' },
});

module.exports = Bill;

