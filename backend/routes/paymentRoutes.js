const express = require('express');
const router = express.Router();
const { getPaymentConfig, processCharge, getTransactions } = require('../controllers/paymentController');

// GET /api/v1/payments/config - Retrieve current gateway status and merchant ID
router.get('/config', getPaymentConfig);

// POST /api/v1/payments/charge - Process card/digital payment through Clover
router.post('/charge', processCharge);

// GET /api/v1/payments/transactions - Transaction ledger
router.get('/transactions', getTransactions);

module.exports = router;
