const {userAttendEvent} = require('../controllers/SseController.js');
const express = require('express');
const router = express.Router();
router.get('/:id',userAttendEvent);

module.exports = router;