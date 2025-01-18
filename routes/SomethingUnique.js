var express = require('express');
var router = express.Router();
var somethingUniqueController = require('../controllers/somethingUnique');
const upload = require("../helper/imgmulter");


router.post('/add', upload.single('image'), somethingUniqueController.addSomethingUnique);

router.get('/', somethingUniqueController.getSomethingUnique);

router.put('/:updateId', upload.single('image'), somethingUniqueController.updateSomethingUnique);

router.delete('/:deleteId', somethingUniqueController.deleteSomethingUnique);


module.exports = router;