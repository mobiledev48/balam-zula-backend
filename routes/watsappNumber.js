var express = require('express');
var router = express.Router();
var watsappNumberController = require('../controllers/watsappNumber');
// const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', watsappNumberController.addWatsappNumber);

router.get('/', watsappNumberController.getWatsappNumber);

router.put('/:updateId', watsappNumberController.updateWatsappNumber);

router.delete('/:deleteId', watsappNumberController.deleteWatsappNumber);


// router.post('/add', authMiddleware, watsappNumberController.addWatsappNumber);

// router.get('/', authMiddleware, watsappNumberController.getWatsappNumber);

// router.put('/:updateId', authMiddleware, watsappNumberController.updateWatsappNumber);

// router.delete('/:deleteId', authMiddleware, watsappNumberController.deleteWatsappNumber);


module.exports = router;