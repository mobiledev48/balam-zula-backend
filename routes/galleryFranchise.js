var express = require('express');
var router = express.Router();
var galleryFranchiseController = require('../controllers/galleryFranchise');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.fields([{ name: 'images', maxCount: 10 }]), galleryFranchiseController.addGalleryFranchise);

router.get('/', galleryFranchiseController.getGalleryFranchise);

router.put('/:updateId', authMiddleware, upload.fields([{ name: 'images', maxCount: 10 }]), galleryFranchiseController.updateGalleryFranchise);

router.delete('/:deleteId', authMiddleware, galleryFranchiseController.deleteGalleryFranchise);


module.exports = router;