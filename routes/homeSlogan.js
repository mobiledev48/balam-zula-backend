var express = require('express');
var router = express.Router();
var homeSloganController = require('../controllers/homeSlogan');

router.post('/add', homeSloganController.addHomeSlogan);

router.get('/', homeSloganController.getHomeSlogan);

router.put('/:updateId', homeSloganController.updateHomeSlogan);

router.delete('/:deleteId', homeSloganController.deleteHomeSlogan);


module.exports = router;