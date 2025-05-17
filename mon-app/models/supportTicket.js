// models/supportTicket.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SupportTicket = sequelize.define('SupportTicket', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('open', 'resolved', 'closed'), defaultValue: 'open' },
});

module.exports = SupportTicket;
// Compare this snippet from mon-app/server/models%20copy/transaction.js:
// // models/transaction.js

