const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');

// @desc    Add a review for a doctor
// @route   POST /api/reviews
// @access  Private (patient)
const addReview = asyncHandler(async (req, res) => {
  const { doctorId, rating, comment } = req.body;

  if (!doctorId || !rating || !comment) {
    res.status(400);
    throw new Error('Please provide doctorId, rating and comment');
  }

  const alreadyReviewed = await Review.findOne({ doctorId, patientId: req.user._id });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this doctor');
  }

  const review = await Review.create({ patientId: req.user._id, doctorId, rating, comment });
  res.status(201).json({ message: 'Review added successfully', review });
});

// @desc    Get all reviews for a specific doctor
// @route   GET /api/reviews/:doctorId
// @access  Public
const getDoctorReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ doctorId: req.params.doctorId })
    .populate('patientId', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json(reviews);
});

module.exports = { addReview, getDoctorReviews };
