var express = require('express');
var router = express.Router();
var ourCategoriesController = require('../controllers/ourCategories');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.single('image'), ourCategoriesController.addOurCategories);

router.get('/', ourCategoriesController.getOurCategories);

router.put('/:updateId', authMiddleware, upload.single('image'), ourCategoriesController.updateOurCategories);

router.delete('/:deleteId', authMiddleware, ourCategoriesController.deleteOurCategories);


module.exports = router;