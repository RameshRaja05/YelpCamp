const CampgroundModel = require('../models/campground');
const cloudinary = require('cloudinary').v2;
const mbxGeoCoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeoCoding({accessToken:mapBoxToken});

//helper functions
const deletionImages=async(campground,deleteImages)=>{
    for(let filename of deleteImages){
        await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({$pull:{images:{filename:{$in:deleteImages}}}})
}

const getGeodata=async(location)=>{
    const geoData=await geocoder.forwardGeocode({
        query:location,
        limit:1
    }).send();
    return geoData.body.features[0].geometry
}


module.exports.index = async (req, res) => {
    if(!req.query.page){
        const campgrounds=await CampgroundModel.paginate({});
        res.render('campgrounds/index', { campgrounds });
    }else{
        const {page}=req.query;
        const campgrounds=await CampgroundModel.paginate({},{page});
        res.status(200).json(campgrounds);
    }
}

module.exports.renderNewForm = (_req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const newCampground = new CampgroundModel(req.body.campground)
    newCampground.geometry=await getGeodata(req.body.campground.location);
    //assocaiated with current user who is in the session currently
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'successfully made a  new campground')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampgroundModel.findById(id).populate({
        path: 'reviews', populate: {
            path: 'author'
        }
    }).populate('author');
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampgroundModel.findById(id);
    res.render('campgrounds/edit', { campground });
}




module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampgroundModel.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    if(imgs) campground.images.push(...imgs);
    campground.geometry=await getGeodata(req.body.campground.location);
    await campground.save();
    if(req.body.deleteImages){
       const{deleteImages}=req.body;
       await deletionImages(campground,deleteImages);
    };
    req.flash('success', 'successfully edited campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await CampgroundModel.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted a campground')
    res.redirect('/campgrounds');
}


