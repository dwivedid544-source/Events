const express = require('express');
const router = express.Router();
const { getPaymentConfig, processCharge, getTransactions } = require('../controllers/paymentController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// GET /api/v1/payments/config - Retrieve current gateway status and merchant ID
router.get('/config', getPaymentConfig);

// POST /api/v1/payments/charge - Process card/digital payment through Clover
router.post('/charge', processCharge);

// GET /api/v1/payments/transactions - Transaction ledger (Protected)
router.get('/transactions', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN'), getTransactions);

module.exports = router;

