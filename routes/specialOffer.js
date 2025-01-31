var express = require('express');
var router = express.Router();
var specialOfferController = require('../controllers/specialOffer');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.single('image'), specialOfferController.addSpecialOffer);

router.get('/', specialOfferController.getSpecialOffer);

router.put('/:updateId', authMiddleware, upload.single('image'), specialOfferController.updateSpecialOffer);

router.delete('/:deleteId', authMiddleware, specialOfferController.deleteSpecialOffer);


module.exports = router;