var express = require('express');
var router = express.Router();
var latestProductController = require('../controllers/latestProduct');
const upload = require("../helper/imgmulter");


router.post('/add', upload.single('image'), latestProductController.addLatestProduct);

router.get('/', latestProductController.getLatestProduct);

router.put('/:updateId', upload.single('image'), latestProductController.updateLatestProduct);

router.delete('/:deleteId', latestProductController.deleteLatestProduct);


module.exports = router;