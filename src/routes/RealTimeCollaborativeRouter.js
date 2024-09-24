const {boardTextInfo} = require('../controllers/RealTimeCollaborativeController');
const express = require('express');
const router = express.Router();

router.get('/info/:id',boardTextInfo);


module.exports = router;