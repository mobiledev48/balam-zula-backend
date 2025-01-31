var express = require('express');
var router = express.Router();
var latestProductController = require('../controllers/latestProduct');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.single('image'), latestProductController.addLatestProduct);

router.get('/', latestProductController.getLatestProduct);

router.put('/:updateId', authMiddleware, upload.single('image'), latestProductController.updateLatestProduct);

router.delete('/:deleteId', authMiddleware, latestProductController.deleteLatestProduct);


module.exports = router;