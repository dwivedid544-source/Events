const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.get('/', memberController.getMembers);
router.put('/:id/status', memberController.updateMemberStatus);

module.exports = router;
