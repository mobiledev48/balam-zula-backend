var express = require('express');
var router = express.Router();
var customerReviewVideoController = require('../controllers/customerReviewVideo');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.fields([{ name: 'video', maxCount: 2 }]), customerReviewVideoController.addCustomerReviewVideo);

router.get('/', customerReviewVideoController.getCustomerReviewVideo);

router.put('/:updateId', authMiddleware, upload.fields([{ name: 'video', maxCount: 2 }]), customerReviewVideoController.updateCustomerReviewVideo);

router.delete('/:deleteId', authMiddleware, customerReviewVideoController.deleteCustomerReviewVideo);


module.exports = router;