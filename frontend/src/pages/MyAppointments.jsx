import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/my-appointments');
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if(window.confirm('Are you sure you want to cancel this appointment?')) {
       try {
          await api.put(`/appointments/${id}/cancel`);
          fetchAppointments();
       } catch (error) {
          alert('Error cancelling appointment');
       }
    }
  };

  const handleDelete = async (id) => {
     if(window.confirm('Remove this appointment from your history?')) {
       try {
          await api.delete(`/appointments/${id}`);
          fetchAppointments();
       } catch (error) {
          alert('Error deleting appointment');
       }
     }
  };

  return (
    <div className="page">
      <h2>My appointments</h2>
      <div className="appointment-list">
        {appointments.length === 0 ? <p className="empty-state">No appointments booked yet.</p> : null}
        {appointments.map((app) => (
          <div key={app._id} className="appointment-row">
            <div>
              <strong>Dr. {app.doctorId?.name || 'Unknown Doctor'}</strong>
              <p className="muted" style={{ margin: 0 }}>
                {app.doctorId?.specialty || 'Specialist'} · {app.date} at {app.time}
              </p>
            </div>
            <div className="appointment-row-actions">
              <span className={`badge badge-${app.status}`}>{app.status}</span>
              
              {/* Sirf Pending ko Cancel kar sakte hain */}
              {app.status === 'pending' && (
                <button className="link-button danger" onClick={() => handleCancel(app._id)}>Cancel</button>
              )}
              
              {/* Confirmed aur Cancelled dono par Delete ka chota button aayega */}
              {(app.status === 'cancelled' || app.status === 'confirmed') && (
                 <button className="link-button" onClick={() => handleDelete(app._id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}