const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getEvents);
router.get('/entries', eventController.getEntries);
router.get('/:id', eventController.getEventById);
router.post('/:id/pre-signup', eventController.preSignUpEntry);

module.exports = router;
