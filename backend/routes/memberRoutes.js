const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

// Optional auth helper: attaches user if token provided without rejecting public queries
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (_) {
      // ignore invalid token in optional context
    }
  }
  next();
};

router.get('/', optionalAuth, memberController.getMembers);
router.post('/', memberController.createMember);
router.put('/:id/status', memberController.updateMemberStatus);

module.exports = router;
