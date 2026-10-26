const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', clubController.getClubs);
router.post('/', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN'), clubController.createClub);
router.post('/claims', clubController.createClaimRequest);
router.get('/:id', clubController.getClubById);
router.put('/:id', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN'), clubController.updateClub);
router.post('/:id/donations/pledge', clubController.pledgeClubDonation);

module.exports = router;

