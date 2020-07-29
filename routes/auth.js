const express = require('express');
const {body, check} = require('express-validator');

const router = express();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
[
    body('email', 'Please enter a valid email-address')
    .isEmail()
    .normalizeEmail(),
    
],
 authController.postLogin);

router.post('/signup',
[
    body('email', 'Please enter a valid email-address')
    .isEmail()
    .normalizeEmail(),
    body('password')
    .custom((value, {req}) => {
        var upper = value.toString().search("[A-Z]");
        var numeric = value.toString().search("[0-9]");
        // console.log(upper + "  " + numeric);
        
        if(upper === -1 || numeric ===- 1 || value.length < 6) {
            throw new Error('Password must contain atleast 6 characters with atleast one UpperCase character and one numeric character ');
        }
        return true;
    }),
    body('firstName', 'First name should contain atmost 12 characters')
    .isLength({max: 12})
], authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;