var express = require('express');
var router = express.Router();
var followUsMediaController = require('../controllers/followUsMedia');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, upload.single('thumbnail_media'), followUsMediaController.addFollowUsMedia);

router.get('/', followUsMediaController.getFollowUsMedia);

router.put('/:updateId', authMiddleware, upload.single('thumbnail_media'), followUsMediaController.updateFollowUsMedia);

router.delete('/:deleteId', authMiddleware, followUsMediaController.deleteFollowUsMedia);


module.exports = router;