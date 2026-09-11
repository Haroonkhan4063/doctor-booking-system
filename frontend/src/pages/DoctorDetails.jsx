import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';

const DoctorDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingError, setBookingError] = useState('');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewError, setReviewError] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [doctorRes, reviewsRes] = await Promise.all([
      api.get(`/doctors/${id}`),
      api.get(`/reviews/${id}`),
    ]);
    setDoctor(doctorRes.data);
    setReviews(reviewsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingMsg('');
    setBookingError('');
    if (!user) return navigate('/login');
    try {
      await api.post('/appointments', { doctorId: id, date, time });
      setBookingMsg('Appointment requested — check "My appointments" for status.');
      setDate('');
      setTime('');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Could not book this slot');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    setReviewError('');
    if (!user) return navigate('/login');
    try {
      await api.post('/reviews', { doctorId: id, rating: Number(rating), comment });
      setReviewMsg('Review posted, thanks!');
      setComment('');
      loadData();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not post review');
    }
  };

  if (loading) return <Loader />;
  if (!doctor) return <p className="error-text">Doctor not found.</p>;

  return (
    <div className="page doctor-details">
      <div className="doctor-header">
        <div className="doctor-header-avatar">{doctor.name.charAt(0)}</div>
        <div>
          <h1>{doctor.name}</h1>
          <p className="doctor-card-specialty">{doctor.specialty}</p>
          <p className="doctor-card-meta">{doctor.experience} yrs experience · Rs. {doctor.consultationFee} per visit</p>
          {reviews.length > 0 && (
            <p><StarRating value={avgRating} /> <span className="muted">({reviews.length} reviews)</span></p>
          )}
        </div>
      </div>

      <div className="doctor-details-grid">
        <section className="panel">
          <h2>Book an appointment</h2>
          <form onSubmit={handleBook}>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <label>Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            <button type="submit">Request appointment</button>
            {bookingMsg && <p className="success-text">{bookingMsg}</p>}
            {bookingError && <p className="error-text">{bookingError}</p>}
          </form>
        </section>

        <section className="panel">
          <h2>Patient reviews</h2>
          {reviews.length === 0 && (
            <p className="empty-state">No reviews yet — be the first to share your visit.</p>
          )}
          <ul className="review-list">
            {reviews.map((r) => (
              <li key={r._id}>
                <div className="review-head">
                  <strong>{r.patientId?.name || 'Patient'}</strong>
                  <StarRating value={r.rating} />
                </div>
                <p>{r.comment}</p>
              </li>
            ))}
          </ul>

          {user && user.role === 'patient' && (
            <form className="review-form" onSubmit={handleReview}>
              <label>Your rating</label>
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </select>
              <label>Your review</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
              <button type="submit">Post review</button>
              {reviewMsg && <p className="success-text">{reviewMsg}</p>}
              {reviewError && <p className="error-text">{reviewError}</p>}
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default DoctorDetails;
