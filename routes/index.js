var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const mainController = require('../controllers/mainController')

/* GET home page. */
// home page is login form as well
router.get('/', userController.index);



// log-in routes

router.post('/log-in', userController.logInController_post)

router.get('/log-out', userController.LogOutController_get)


//sign up routes
router.get('/sign-up', userController.signUp_Controller_get )

router.post('/sign-up', userController.signUp_Controller_post)


// main page 
router.get('/main', mainController.mainController_get )

module.exports = router;
