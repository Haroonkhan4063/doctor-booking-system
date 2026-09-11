import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to permanently delete this appointment?')) {
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
      <h2>Manage appointments</h2>
      <div className="appointment-list">
        {appointments.length === 0 ? <p className="empty-state">No appointments found.</p> : null}
        {appointments.map((app) => (
          <div key={app._id} className="appointment-row">
            <div>
              <strong>{app.patientId?.name || 'Unknown Patient'}</strong>
              <p className="muted" style={{ margin: 0 }}>
                with Dr. {app.doctorId?.name || 'Unknown'} · {app.date} at {app.time}
              </p>
            </div>
            <div className="appointment-row-actions">
              <span className={`badge badge-${app.status}`}>{app.status}</span>
              
              {/* Pending par sirf Confirm aur Cancel */}
              {app.status === 'pending' && (
                <>
                  <button className="secondary-button" onClick={() => handleStatus(app._id, 'cancelled')}>Cancel</button>
                  <button onClick={() => handleStatus(app._id, 'confirmed')}>Confirm</button>
                </>
              )}

              {/* Cancelled ya Confirmed hone par Delete ka option */}
              {(app.status === 'cancelled' || app.status === 'confirmed') && (
                 <button 
                    className="secondary-button" 
                    style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} 
                    onClick={() => handleDelete(app._id)}
                 >
                    Delete
                 </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}