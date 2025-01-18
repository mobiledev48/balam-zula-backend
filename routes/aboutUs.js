var express = require('express');
var router = express.Router();
var aboutUsController = require('../controllers/aboutUs');
const upload = require("../helper/imgmulter");


router.post('/add', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), aboutUsController.addAboutUs);

router.get('/', aboutUsController.getAboutUs);

router.put('/:updateId', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), aboutUsController.updateAboutUs);

router.delete('/:deleteId', aboutUsController.deleteAboutUs);


module.exports = router;