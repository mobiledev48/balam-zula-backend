var express = require('express');
var router = express.Router();
var ourStoryPurposeController = require('../controllers/ourStoryPurpose');
const upload = require("../helper/imgmulter");


router.post('/add', upload.single('image'), ourStoryPurposeController.addOurStoryPurpose);

router.get('/', ourStoryPurposeController.getOurStoryPurpose);

router.put('/:updateId', upload.single('image'), ourStoryPurposeController.updateOurStoryPurpose);

router.delete('/:deleteId', ourStoryPurposeController.deleteOurStoryPurpose);


module.exports = router;