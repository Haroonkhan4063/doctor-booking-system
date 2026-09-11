import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => (
  <Link to={`/doctors/${doctor._id}`} className="doctor-card">
    <div className="doctor-card-avatar">{doctor.name.charAt(0)}</div>
    <div className="doctor-card-body">
      <h3>{doctor.name}</h3>
      <p className="doctor-card-specialty">{doctor.specialty}</p>
      <p className="doctor-card-meta">{doctor.experience} yrs experience · Rs. {doctor.consultationFee}</p>
    </div>
  </Link>
);

export default DoctorCard;
