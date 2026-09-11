const asyncHandler = require('express-async-handler');
const Doctor = require('../models/doctorModel');

// @desc    Add a new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const addDoctor = asyncHandler(async (req, res) => {
  const { name, email, specialty, experience, consultationFee, image } = req.body;

  if (!name || !email || !specialty || experience === undefined || consultationFee === undefined) {
    res.status(400);
    throw new Error('Please provide name, email, specialty, experience and consultationFee');
  }

  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) {
    res.status(400);
    throw new Error('Doctor already exists');
  }

  const doctor = await Doctor.create({ name, email, specialty, experience, consultationFee, image });
  res.status(201).json({ message: 'Doctor added successfully', doctor });
});

// @desc    Get all doctors — supports ?specialty=, ?search=, ?page=, ?limit=
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = asyncHandler(async (req, res) => {
  const { specialty, search, page = 1, limit = 10 } = req.query;

  const query = {};
  if (specialty) query.specialty = { $regex: specialty, $options: 'i' };
  if (search) query.$text = { $search: search };

  const doctors = await Doctor.find(query)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await Doctor.countDocuments(query);

  res.status(200).json({
    doctors,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)) || 1,
    totalDoctors: total,
  });
});

// @desc    Get single doctor by id
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  res.status(200).json(doctor);
});

// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  Object.assign(doctor, req.body);
  const updatedDoctor = await doctor.save();

  res.status(200).json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
});

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  await doctor.deleteOne();
  res.status(200).json({ message: 'Doctor removed successfully' });
});

module.exports = { addDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor };
