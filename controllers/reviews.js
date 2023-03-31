const CampgroundModel = require('../models/campground');
const ReviewModel = require('../models/review');

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampgroundModel.findById(id);
    const review = new ReviewModel(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', 'successfully created a new review');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    //campground.reviews is array of review id's 
    //pull operator helps us to delete a particular review id from campground
    //it pulls out specified review_Id
    await CampgroundModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await ReviewModel.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);

}