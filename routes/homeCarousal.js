var express = require('express');
var router = express.Router();
var homeCarousalController = require('../controllers/homeCarousal');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.single('image'), homeCarousalController.addHomeCarousal);

router.get('/', homeCarousalController.getHomeCarousal);

router.put('/:updateId', authMiddleware, upload.single('image'), homeCarousalController.updateHomeCarousal);

router.delete('/:deleteId', authMiddleware, homeCarousalController.deleteHomeCarousal);


module.exports = router;