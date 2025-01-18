var express = require('express');
var router = express.Router();
var ourCategoriesController = require('../controllers/ourCategories');
const upload = require("../helper/imgmulter");


router.post('/add', upload.single('image'), ourCategoriesController.addOurCategories);

router.get('/', ourCategoriesController.getOurCategories);

router.put('/:updateId', upload.single('image'), ourCategoriesController.updateOurCategories);

router.delete('/:deleteId', ourCategoriesController.deleteOurCategories);


module.exports = router;