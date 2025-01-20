var express = require('express');
var router = express.Router();
var contactUsController = require('../controllers/contactUs');


router.post('/add', contactUsController.addContactUs);

router.get('/', contactUsController.getContactUs);

router.put('/:updateId', contactUsController.updateContactUs);

router.delete('/:deleteId', contactUsController.deleteContactUs);


module.exports = router;