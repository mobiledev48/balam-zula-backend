var express = require('express');
var router = express.Router();
var homeCarousalController = require('../controllers/homeCarousal');
const upload = require("../helper/imgmulter");


router.post('/add', upload.single('image'), homeCarousalController.addHomeCarousal);

router.get('/', homeCarousalController.getHomeCarousal);

router.put('/:updateId', upload.single('image'), homeCarousalController.updateHomeCarousal);

router.delete('/:deleteId', homeCarousalController.deleteHomeCarousal);


module.exports = router;