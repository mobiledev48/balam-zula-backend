var express = require('express');
var router = express.Router();
var followUsMediaController = require('../controllers/followUsMedia');
const upload = require("../helper/imgmulter");


router.post('/add', upload.single('thumbnail_media'), followUsMediaController.addFollowUsMedia);

router.get('/', followUsMediaController.getFollowUsMedia);

router.put('/:updateId', upload.single('thumbnail_media'), followUsMediaController.updateFollowUsMedia);

router.delete('/:deleteId', followUsMediaController.deleteFollowUsMedia);


module.exports = router;