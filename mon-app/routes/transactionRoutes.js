// routes/transactionRoutes.js
const express = require('express');
const { transferMoney, payBill } = require('../controllers/transactionController');
const router = express.Router();

router.post('/transfer', transferMoney);
router.post('/pay-bill', payBill);

module.exports = router;
