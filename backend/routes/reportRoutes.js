const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

const REPORT_ADMINS = ['SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN'];

router.get('/financial-overview', verifyToken, requireRole(...REPORT_ADMINS), reportController.getFinancialOverview);
router.get('/state-performance', verifyToken, requireRole(...REPORT_ADMINS), reportController.getStatePerformanceReport);
router.get('/revenue-commissions', verifyToken, requireRole(...REPORT_ADMINS), reportController.getRevenueCommissionsReport);

module.exports = router;
