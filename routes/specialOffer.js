var express = require('express');
var router = express.Router();
var specialOfferController = require('../controllers/specialOffer');
const upload = require("../helper/imgmulter");


router.post('/add', upload.single('image'), specialOfferController.addSpecialOffer);

router.get('/', specialOfferController.getSpecialOffer);

router.put('/:updateId', upload.single('image'), specialOfferController.updateSpecialOffer);

router.delete('/:deleteId', specialOfferController.deleteSpecialOffer);


module.exports = router;