var express = require('express');
var router = express.Router();
var aboutFranchiseController = require('../controllers/aboutFranchise');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.single('image'), aboutFranchiseController.addAboutFranchise);

router.get('/', aboutFranchiseController.getAboutFranchise);

router.put('/:updateId', authMiddleware, upload.single('image'), aboutFranchiseController.updateAboutFranchise);

router.delete('/:deleteId', authMiddleware, aboutFranchiseController.deleteAboutFranchise);


module.exports = router;