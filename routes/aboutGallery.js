var express = require('express');
var router = express.Router();
var aboutGalleryController = require('../controllers/aboutGallery');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.fields([{ name: 'images', maxCount: 10 }]), aboutGalleryController.addAboutGallery);

router.get('/', aboutGalleryController.getAboutGallery);

router.put('/:updateId', authMiddleware, upload.fields([{ name: 'images', maxCount: 10 }]), aboutGalleryController.updateAboutGallery);

router.delete('/:deleteId', authMiddleware, aboutGalleryController.deleteAboutGallery);


module.exports = router;