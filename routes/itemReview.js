var express = require('express');
var router = express.Router();
var itemReviewController = require('../controllers/itemReview');
const upload = require("../helper/imgmulter");


router.post('/add', upload.fields([{ name: 'reviewImage', maxCount: 10 }]), itemReviewController.addItemReview);

router.get('/', itemReviewController.getItemReview);

router.get('/ourCategoriesItem/:itemId', itemReviewController.getItemReviewByCategoryItemId);

router.delete('/:deleteId', itemReviewController.deleteItemReview);


module.exports = router;