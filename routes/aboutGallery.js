var express = require('express');
var router = express.Router();
var aboutGalleryController = require('../controllers/aboutGallery');
const upload = require("../helper/imgmulter");


router.post('/add', upload.fields([{ name: 'images', maxCount: 10 }]), aboutGalleryController.addAboutGallery);

router.get('/', aboutGalleryController.getAboutGallery);

router.put('/:updateId', upload.fields([{ name: 'images', maxCount: 10 }]), aboutGalleryController.updateAboutGallery);

router.delete('/:deleteId', aboutGalleryController.deleteAboutGallery);


module.exports = router;