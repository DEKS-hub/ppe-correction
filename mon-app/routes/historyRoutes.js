// routes/historyRoutes.js
const express = require('express');
const { getTransactionHistory } = require('../controllers/transactionHistoryController');
const router = express.Router();

router.get('/history', getTransactionHistory);

module.exports = router;
