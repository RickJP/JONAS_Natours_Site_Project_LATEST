const Tour = require('../models/tourModel.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync( async (req, res, next) => {
  // Get all tour data from collection
  const tours = await Tour.find();

  // Build template
  // render the template using tour data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});


exports.getTour = catchAsync( async (req,res, next) => {
  // Get data for requested tour (including reviews & guides)
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }


  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour
  });
});


exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};