var express = require('express');
var router = express.Router();
var ourCategoriesItemController = require('../controllers/ourCategoriesItems');
const upload = require("../helper/imgmulter");


router.post('/add', upload.fields([{ name: 'images', maxCount: 10 }]), ourCategoriesItemController.addOurCategoriesItems);

router.get('/', ourCategoriesItemController.getOurCategoriesItems);

router.get('/:Id', ourCategoriesItemController.getSingleOurCategoriesItems);

router.get('/ourCategories/:categoryId', ourCategoriesItemController.getOurCategoriesItemsByCategoryId);

router.put('/:updateId', upload.fields([{ name: 'images', maxCount: 10 }]), ourCategoriesItemController.updateOurCategoriesItems);

router.delete('/:deleteId', ourCategoriesItemController.deleteOurCategoriesItems);


module.exports = router;