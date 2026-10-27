const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (_) {}
  }
  next();
};

router.get('/', clubController.getClubs);
router.post('/claims', clubController.createClaimRequest);
router.get('/:id', clubController.getClubById);
router.put('/:id', optionalAuth, clubController.updateClub);
router.post('/:id/donations/pledge', clubController.pledgeClubDonation);

module.exports = router;
