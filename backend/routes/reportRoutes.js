const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/financial-overview', reportController.getFinancialOverview);
router.get('/state-performance', reportController.getStatePerformanceReport);
router.get('/revenue-commissions', reportController.getRevenueCommissionsReport);

module.exports = router;
