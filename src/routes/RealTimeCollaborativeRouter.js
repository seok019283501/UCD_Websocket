const {boardTextInfo,exitRoom} = require('../controllers/RealTimeCollaborativeController');
const express = require('express');
const {verifyToken} = require('../middlewares/jwt.js');
const router = express.Router();

router.get('/info/:id',verifyToken,boardTextInfo);


module.exports = router;