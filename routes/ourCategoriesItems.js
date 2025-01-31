var express = require('express');
var router = express.Router();
var ourCategoriesItemController = require('../controllers/ourCategoriesItems');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.fields([{ name: 'images', maxCount: 10 }]), ourCategoriesItemController.addOurCategoriesItems);

router.get('/', ourCategoriesItemController.getOurCategoriesItems);

router.get('/:Id', ourCategoriesItemController.getSingleOurCategoriesItems);

router.get('/ourCategories/:categoryId', ourCategoriesItemController.getOurCategoriesItemsByCategoryId);

router.get('/someUnique/CategoryItems', ourCategoriesItemController.getOurCategoriesItemsDisplayingInSomethingUnique);

router.put('/:updateId', authMiddleware, upload.fields([{ name: 'images', maxCount: 10 }]), ourCategoriesItemController.updateOurCategoriesItems);

router.delete('/:deleteId', authMiddleware, ourCategoriesItemController.deleteOurCategoriesItems);


module.exports = router;