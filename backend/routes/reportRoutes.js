const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/financial-overview', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN'), reportController.getFinancialOverview);
router.get('/state-performance', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN'), reportController.getStatePerformanceReport);
router.get('/revenue-commissions', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN'), reportController.getRevenueCommissionsReport);

module.exports = router;

