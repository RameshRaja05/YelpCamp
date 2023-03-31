const express = require('express');
//merge a param in router it behaves lil diff 
const router = express.Router({ mergeParams: true });
//custom error class
const catchAsync = require('../utils/catchAsync');

//middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

//controllers
const reviews = require('../controllers/reviews');

//review for every single campground
//review routes

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//delete route /campgrounds/:id/reviews/:reviewId
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router