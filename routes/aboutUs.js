var express = require('express');
var router = express.Router();
var aboutUsController = require('../controllers/aboutUs');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), aboutUsController.addAboutUs);

router.get('/', aboutUsController.getAboutUs);

router.put('/:updateId', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), aboutUsController.updateAboutUs);

router.delete('/:deleteId', authMiddleware, aboutUsController.deleteAboutUs);


module.exports = router;