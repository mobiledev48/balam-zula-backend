var express = require('express');
var router = express.Router();
var itemReviewController = require('../controllers/itemReview');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', upload.fields([{ name: 'reviewImage', maxCount: 10 }]), itemReviewController.addItemReview);

router.get('/', authMiddleware, itemReviewController.getItemReview);

router.get('/ourCategoriesItem/:itemId', itemReviewController.getItemReviewByCategoryItemId);

router.delete('/:deleteId', authMiddleware, itemReviewController.deleteItemReview);

router.put('/:updateId', authMiddleware, itemReviewController.updateItemReviewStatus);


module.exports = router;