const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
//controller
const users = require('../controllers/users')

//render a form and submit a form
router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register))


//login routes
//render a form
//auth route
//plug in passport authenticate middleware
router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)
//logout route

router.post('/logout', users.logout);

module.exports = router