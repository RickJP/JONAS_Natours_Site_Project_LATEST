const Tour = require('../models/tourModel.js');
const catchAsync = require('../utils/catchAsync');

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
  // Build template

  // Render template using data


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