var express = require('express');
var router = express.Router();
const adminController = require("../controllers/admin");


router.post('/registration', adminController.adminRegistration);

router.post('/login', adminController.adminLogin);

router.get('/', adminController.GetallAdmin);


module.exports = router;