const express = require('express');
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, bookAppointment); 
router.get('/my-appointments', protect, getMyAppointments);
router.get('/', protect, getAllAppointments); 
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);
router.delete('/:id', protect, deleteAppointment); 

module.exports = router;