var express = require('express');
var router = express.Router();
var customerReviewVideoController = require('../controllers/customerReviewVideo');
const upload = require("../helper/imgmulter");


router.post('/add', upload.fields([{ name: 'video', maxCount: 2 }]), customerReviewVideoController.addCustomerReviewVideo);

router.get('/', customerReviewVideoController.getCustomerReviewVideo);

router.put('/:updateId', upload.fields([{ name: 'video', maxCount: 2 }]), customerReviewVideoController.updateCustomerReviewVideo);

router.delete('/:deleteId', customerReviewVideoController.deleteCustomerReviewVideo);


module.exports = router;