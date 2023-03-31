const express = require('express');
const router = express.Router();
//file handling middleware
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({
    storage,
    limits: { fileSize: 500000 }
});


//custom error classes
const catchAsync = require('../utils/catchAsync');
//controllers
const campgrounds = require('../controllers/campgrounds');

//middlewares
const { isLoggedIn, isAuthor, isValidCampground, validateCampground, multerErrorHandler } = require('../middleware');
//index route and create or post route
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image', 7), multerErrorHandler, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm);
//show route and update route and delete route
router.route('/:id')
    .get(isValidCampground, catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isValidCampground,isAuthor, upload.array('image', 7), multerErrorHandler, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isValidCampground,isAuthor, catchAsync(campgrounds.deleteCampground))
//update route

router.get('/:id/edit', isLoggedIn, isValidCampground, catchAsync(campgrounds.renderEditForm))

module.exports = router;