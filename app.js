var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeCarousalRouter = require('./routes/homeCarousal');
var ourCategoriesRouter = require('./routes/ourCategories');
var ourCategoriesItemsRouter = require('./routes/ourCategoriesItems');
var aboutUsRouter = require('./routes/aboutUs');
var somethingUniqueRouter = require('./routes/SomethingUnique');
var watsappNumberRouter = require('./routes/watsappNumber');
var itemReviewRouter = require('./routes/itemReview');
var contactUsRouter = require('./routes/contactUs');
var specialOfferRouter = require('./routes/specialOffer');
var ourStoryPurposeRouter = require('./routes/ourStoryPurpose');
var latestProductRouter = require('./routes/latestProduct');
var homeSloganRouter = require('./routes/homeSlogan');
var aboutGalleryRouter = require('./routes/aboutGallery');
var customerReviewVideoRouter = require('./routes/customerReviewVideo');
var adminRouter = require('./routes/admin');

var app = express();

// MongoDB Connection !
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Database connected successfully !'))
  .catch((error) => console.log(error.message))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors(
  {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/homeCarousal', homeCarousalRouter);
app.use('/ourCategories', ourCategoriesRouter);
app.use('/ourCategoriesItems', ourCategoriesItemsRouter);
app.use('/aboutUs', aboutUsRouter);
app.use('/somethingUnique', somethingUniqueRouter);
app.use('/watsappNumber', watsappNumberRouter);
app.use('/itemReview', itemReviewRouter);
app.use('/contactUs', contactUsRouter);
app.use('/specialOffer', specialOfferRouter);
app.use('/ourStoryPurpose', ourStoryPurposeRouter);
app.use('/latestProduct', latestProductRouter);
app.use('/homeSlogan', homeSloganRouter);
app.use('/aboutGallery', aboutGalleryRouter);
app.use('/customerReviewVideo', customerReviewVideoRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;