// routes/supportRoutes.js
const express = require('express');
const { contactSupport } = require('../controllers/supportController');
const router = express.Router();

router.post('/contact', contactSupport);

module.exports = router;
