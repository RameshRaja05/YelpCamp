
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ReviewModel = require('./review');
mongoose.set('strictQuery', false);
const cloudinary = require('cloudinary').v2;
//images schema
const ImageSchema = new Schema({
    url: String,
    filename: String
})

// thumbnail images 
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload/', '/upload/w_150/');
})

//card images

ImageSchema.virtual('cardImage').get(function () {
    return this.url.replace('/upload/', '/upload/ar_4:3,c_crop/');
})

//for virtuals

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location:String,
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},opts)

//cluster map markup
campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href=/campgrounds/${this._id}>${this.title}</a></strong>`
})

//delete associated reviews of deleted campground
campgroundSchema.post('findOneAndDelete', async (campground) => {
    if (campground) {
        if (campground.reviews) {
            await ReviewModel.deleteMany({
                _id: {
                    $in: campground.reviews
                }
            })
        }
        if (campground.images) {
            const seeds = [
                'YelpCamp/esf2xdqcce4jl1vp8dlp',
                "YelpCamp/qgcjqnfnkmyhhy3sq1ph",
                "YelpCamp/bh2djzn4kwucrh6w9vek",
            ]

            for (const img of campground.images) {
                if (!(img.filename in seeds)) {
                    await cloudinary.uploader.destroy(img.filename);
                }
            }
        }
    }
})

const campGround = mongoose.model('campground', campgroundSchema)

module.exports = campGround;

