const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// GET /api/v1/club-claims - List claims (Admin only)
router.get('/', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN'), claimController.getClaims);

// POST /api/v1/club-claims - Submit claim (Public or Authenticated)
router.post('/', claimController.createClaim);

// PUT /api/v1/club-claims/:id - Update claim decision (Super Admin only)
router.put('/:id', verifyToken, requireRole('SUPER_ADMIN'), claimController.updateClaimStatus);

module.exports = router;
