var express = require('express');
var router = express.Router();
var contactUsController = require('../controllers/contactUs');
const upload = require("../helper/imgmulter");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/add', authMiddleware, upload.single('image'), contactUsController.addContactUs);

router.get('/', contactUsController.getContactUs);

router.put('/:updateId', authMiddleware, upload.single('image'), contactUsController.updateContactUs);

router.delete('/:deleteId', authMiddleware, contactUsController.deleteContactUs);


module.exports = router;