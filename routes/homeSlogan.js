var express = require('express');
var router = express.Router();
var homeSloganController = require('../controllers/homeSlogan');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, homeSloganController.addHomeSlogan);

router.get('/', homeSloganController.getHomeSlogan);

router.put('/:updateId', authMiddleware, homeSloganController.updateHomeSlogan);

router.delete('/:deleteId', authMiddleware, homeSloganController.deleteHomeSlogan);


module.exports = router;