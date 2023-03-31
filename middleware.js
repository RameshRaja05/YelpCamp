const CampgroundModel = require('./models/campground');
const ReviewModel = require('./models/review');
const { ObjectId } = require('mongoose').Types
const ExpressError = require('./utils/expressError');
//joi validation schema
const { campgroundSchema, reviewSchema } = require('./schemas');
const multer = require('multer');

module.exports.isValidCampground = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        req.flash('error', 'Invalid Id');
        return res.redirect('/campgrounds')
    }
    const campground = await CampgroundModel.findById(id);
    if (!campground) {
        req.flash('error', 'cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    next()
}

//check auth if user is logged in or not
//passport helpers it stores the user id in session when user signed in
//isAuthenticate()--return value is boolean
module.exports.isLoggedIn = (req, res, next) => {
    const { id } = req.params;
    if (!(req.isAuthenticated())) {
        req.session.returnTo = (req.query._method === 'DELETE' ? `/campgrounds/${id}` : req.originalUrl);
        req.flash('error', 'you must be signed in')
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await CampgroundModel.findById(id);
    if (!(camp.author.equals(req.user._id))) {
        req.flash('error', 'you don`t have a permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await ReviewModel.findById(reviewId);
    if (!(review.author.equals(req.user._id))) {
        req.flash('error', 'you don`t have a permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//validate a schemas
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return next(new Error(err, 500));
    } else if (err) {
        return next(new Error(err, 500));
    }
    next();
};