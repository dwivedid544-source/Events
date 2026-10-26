const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN'), memberController.getMembers);
router.post('/', memberController.createMember);
router.put('/:id/status', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN'), memberController.updateMemberStatus);

module.exports = router;

