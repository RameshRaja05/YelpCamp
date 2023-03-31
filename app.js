if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}




const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
//security lib
const mongoSanitize=require('express-mongo-sanitize');
//custom error classes
const ExpressError = require('./utils/expressError');
const app = express();
const path = require('path');
//routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const User = require('./models/user');
const session = require('express-session');
const MongoStore=require('connect-mongo');
const flash = require('connect-flash');
const favicon=require('serve-favicon');
const passport = require('passport');
const localStrategy = require('passport-local');
const helmet=require('helmet');
const dbUrl=process.env.DB_URL||'mongodb://127.0.0.1:27017/yelp-camp'
async function connection() {
    await mongoose.connect(dbUrl)

}
connection().catch(err => console.log(err));


//set a engine to ejs mate
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//serving static files
app.use(express.static(path.join(__dirname, '/public')))
app.use(favicon(path.join(__dirname, 'public', 'images/plant.png')));
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );

const secret=process.env.SECRET||'thisshouldbebettersecret'

//mongo store 
const store=MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*60*60,
    crypto:{
        secret
    }
})

//config session
const sessionConfig = {
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure=true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());
//add a passport middleware
app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//helmet middleware
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://res.cloudinary.com/dwed6vcds/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://res.cloudinary.com/dwed6vcds/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://res.cloudinary.com/dwed6vcds/"
];
const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwed6vcds/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            mediaSrc   : [ "https://res.cloudinary.com/dwed6vcds/" ],
            childSrc   : [ "blob:" ]
        },
        crossOriginEmbedderPolicy: false
    })
);

// app.use(helmet());


//for deprecation warning
mongoose.set('strictQuery', false);


//flash message middleware
app.use((req, res, next) => {
    //passport passes user info in session
    //note it needs to define after passport deseralize and serialize middleware
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//routes for camp and rev
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

// app.get('/fakeuser',async(req,res)=>{
//     const user=new User({email:'hoo@gmail.com',username:'The'})
//     const newUser=await User.register(user,'hoo');
//     res.send(newUser);
// })

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 400))
})

//error handling middleware

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no something went wrong';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('serving on port 3000');
})

//attrib +h .gitignore
//start .gitignore
