var express = require('express');
var router = express.Router();
var ourStoryPurposeController = require('../controllers/ourStoryPurpose');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, upload.single('image'), ourStoryPurposeController.addOurStoryPurpose);

router.get('/', ourStoryPurposeController.getOurStoryPurpose);

router.put('/:updateId', authMiddleware, upload.single('image'), ourStoryPurposeController.updateOurStoryPurpose);

router.delete('/:deleteId', authMiddleware, ourStoryPurposeController.deleteOurStoryPurpose);


module.exports = router;