const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

router.get('/', clubController.getClubs);
router.post('/claims', clubController.createClaimRequest);
router.get('/:id', clubController.getClubById);
router.post('/:id/donations/pledge', clubController.pledgeClubDonation);

module.exports = router;
