const db = require('../db');
const https = require('https');
require('dotenv').config();

// Get active Clover Payment Gateway configuration
const getPaymentConfig = (req, res) => {
  const merchantId = process.env.CLOVER_MERCHANT_ID || '526695041883';

  return res.json({
    success: true,
    gateway: 'Clover',
    merchantId,
    status: 'SANDBOX_PENDING_GATEWAY',
    currency: 'USD',
    isConfigured: false,
    isLiveGateway: false,
    supportedMethods: ['Credit Card (Sandbox)', 'Debit Card (Sandbox)'],
    message: 'Clover Payment Gateway is in sandbox/testing mode. Live payment settlement is not connected.'
  });
};

// Process / Charge a payment through Clover Gateway (Honest simulation, no false live claims)
const processCharge = async (req, res) => {
  try {
    const {
      amount,
      currency = 'USD',
      customerName,
      email,
      orderId,
      category = 'ORDER',
      description,
      stateId,
      clubId,
      cardLast4 = '4242'
    } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Payment amount must be greater than 0' }
      });
    }

    const merchantId = process.env.CLOVER_MERCHANT_ID || '526695041883';
    const txnId = `TXN-SIM-${Date.now().toString().slice(-8)}`;
    const authCode = `SIM-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Record simulated transaction in FinancialTransaction table with clear test indicator
    try {
      await db.query(
        `INSERT INTO \`FinancialTransaction\` (\`id\`, \`type\`, \`category\`, \`amount\`, \`period\`, \`stateId\`, \`clubId\`, \`description\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          txnId,
          'PAYMENT_IN',
          category,
          Number(amount),
          new Date().toISOString().slice(0, 7), // YYYY-MM
          stateId || 'TN',
          clubId || 'club-1',
          description || `[SIMULATED] Payment for ${customerName || 'Customer'} | Ref: ${txnId} | Live Clover Not Integrated`
        ]
      );
    } catch (dbErr) {
      console.warn('[DB FinancialTransaction Log Warning]:', dbErr.message);
    }

    return res.json({
      success: true,
      transactionId: txnId,
      authCode,
      gateway: 'Clover (Sandbox Simulation)',
      merchantId,
      amount: Number(amount),
      currency,
      status: 'SIMULATED_TEST',
      paymentStatus: 'Pending Verification',
      isLiveCharge: false,
      cardSummary: `•••• ${cardLast4}`,
      customerName: customerName || 'Valued Member',
      email: email || '',
      orderId: orderId || null,
      timestamp: new Date().toISOString(),
      message: `Simulated transaction of $${Number(amount).toFixed(2)} recorded for testing. Live Clover payment integration pending.`
    });
  } catch (err) {
    console.error('[Payment Controller Error]:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'PAYMENT_FAILED', message: err.message || 'Payment processing failed' }
    });
  }
};

// Retrieve recent transactions from DB
const getTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM `FinancialTransaction` ORDER BY `createdAt` DESC LIMIT 50'
    );
    return res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'DB_ERROR', message: err.message }
    });
  }
};

module.exports = {
  getPaymentConfig,
  processCharge,
  getTransactions
};
