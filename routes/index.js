var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', userController.index);




// sign in routes
// router.get('/log-in', )

router.post('/log-in')


//sign up routes
router.get('/sign-up', userController.signUp_Controller_get )

router.post('/sign-up', userController.signUp_Controller_post)


// main page 
router.get('/main')

module.exports = router;
