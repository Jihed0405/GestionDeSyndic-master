const express=require('express');
const router = express.Router();
const authController= require('../controllers/authController');

//Register
router.post('/register',authController.register);
//login
router.post('/login',authController.login);
//forgetPassword 
router.post('/resetPassword/:id',authController.resetPassword);
router.post('/password',authController.forgetPassword);





module.exports = router