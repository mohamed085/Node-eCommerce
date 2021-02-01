const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const User = require('./model/user');
const MONGODB_URL = 'mongodb://localhost:27017/shop';

/**
 * Routes classes
 */
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorController = require('./controller/error');

const app = express();

/**
 * Using connect-mongodb-session To Store session in mongodb
 */
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'session',
});

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).fields([{
            name: 'imageURL1',
            maxCount: 1
        }, {
            name: 'imageURL2',
            maxCount: 1
        }, {
            name: 'imageURL3',
            maxCount: 1
        }, {
            name: 'imageURL4',
            maxCount: 1
        }]));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

/**
 * Configure Session Middleware
 */
app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(user.email === 'admin@test.com'){
                req.isAdmin = true;
            }else {
                req.isAdmin = false;
            }
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAdmin = req.isAdmin;
    next();
})

/**
 * Set routes for admin side and shop
 */
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

/**
 * set not found page for else page
 */
app.use(errorController);

/**
 * Connected to database using mongoose
 */
mongoose
    .connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(value => {
        console.log("Connection successfully!!!!!!!!!!!!!!")
        app.listen(3000)
    })
    .catch(reason => {
        console.log(reason)
    })
