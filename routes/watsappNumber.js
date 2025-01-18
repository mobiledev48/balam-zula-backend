var express = require('express');
var router = express.Router();
var watsappNumberController = require('../controllers/watsappNumber');


router.post('/add', watsappNumberController.addWatsappNumber);

router.get('/', watsappNumberController.getWatsappNumber);

router.put('/:updateId', watsappNumberController.updateWatsappNumber);

router.delete('/:deleteId', watsappNumberController.deleteWatsappNumber);


module.exports = router;