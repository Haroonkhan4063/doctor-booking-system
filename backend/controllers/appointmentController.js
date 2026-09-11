const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointmentModel');

const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, time } = req.body;
  const existingAppointment = await Appointment.findOne({ doctorId, date, time, status: { $ne: 'cancelled' } });
  if (existingAppointment) {
    res.status(400);
    throw new Error('Doctor is already booked at this time slot');
  }
  const appointment = await Appointment.create({
    patientId: req.user._id,
    doctorId,
    date,
    time
  });
  res.status(201).json({ message: 'Appointment booked successfully', appointment });
});

const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user._id })
    .populate('doctorId', 'name specialty')
    .sort({ createdAt: -1 });
  res.status(200).json(appointments);
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('patientId', 'name email')
    .populate('doctorId', 'name specialty')
    .sort({ createdAt: -1 });
  res.status(200).json(appointments);
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  appointment.status = status;
  await appointment.save();
  res.status(200).json({ message: `Appointment ${status}`, appointment });
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  if (appointment.patientId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }
  appointment.status = 'cancelled';
  await appointment.save();
  res.status(200).json({ message: 'Appointment cancelled', appointment });
});

const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  await appointment.deleteOne();
  res.status(200).json({ message: 'Appointment deleted completely' });
});

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment
};