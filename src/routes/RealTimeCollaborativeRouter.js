const {boardTextInfo,exitRoom} = require('../controllers/RealTimeCollaborativeController');
const express = require('express');
const {verifyToken} = require('../middlewares/jwt.js');
const router = express.Router();

router.get('/info/:id',verifyToken,boardTextInfo);
router.get('/exit/:id',verifyToken,exitRoom);


module.exports = router;