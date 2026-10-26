const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', eventController.getEvents);
router.get('/entries', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN', 'EVENT_ADMIN'), eventController.getEntries);
router.get('/:id', eventController.getEventById);
router.post('/', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN', 'EVENT_ADMIN'), eventController.createEvent);
router.put('/:id', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN', 'EVENT_ADMIN'), eventController.updateEvent);
router.delete('/:id', verifyToken, requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN'), eventController.deleteEvent);
router.post('/:id/pre-signup', verifyToken, eventController.preSignUpEntry);

module.exports = router;


