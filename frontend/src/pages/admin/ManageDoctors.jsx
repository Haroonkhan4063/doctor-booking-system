import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const emptyForm = { name: '', email: '', specialty: '', experience: '', consultationFee: '', image: '' };

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/doctors', { params: { limit: 100 } });
    setDoctors(data.doctors);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      experience: Number(form.experience),
      consultationFee: Number(form.consultationFee),
    };
    try {
      if (editingId) {
        await api.put(`/doctors/${editingId}`, payload);
      } else {
        await api.post('/doctors', payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save doctor');
    }
  };

  const handleEdit = (doc) => {
    setEditingId(doc._id);
    setForm({
      name: doc.name,
      email: doc.email,
      specialty: doc.specialty,
      experience: doc.experience,
      consultationFee: doc.consultationFee,
      image: doc.image || '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this doctor?')) return;
    await api.delete(`/doctors/${id}`);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>Manage doctors</h1>

      <form className="panel doctor-form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit doctor' : 'Add a doctor'}</h2>
        {error && <p className="error-text">{error}</p>}
        <div className="form-grid">
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Specialty</label>
            <input name="specialty" value={form.specialty} onChange={handleChange} required />
          </div>
          <div>
            <label>Experience (years)</label>
            <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} required />
          </div>
          <div>
            <label>Consultation fee (Rs.)</label>
            <input name="consultationFee" type="number" min="0" value={form.consultationFee} onChange={handleChange} required />
          </div>
          <div>
            <label>Image URL (optional)</label>
            <input name="image" value={form.image} onChange={handleChange} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Add doctor'}</button>
          {editingId && (
            <button type="button" className="secondary-button" onClick={resetForm}>Cancel edit</button>
          )}
        </div>
      </form>

      <ul className="admin-doctor-list">
        {doctors.map((doc) => (
          <li key={doc._id} className="appointment-row">
            <div>
              <strong>{doc.name}</strong>
              <p className="muted">{doc.specialty} · {doc.experience} yrs · Rs. {doc.consultationFee}</p>
            </div>
            <div className="appointment-row-actions">
              <button className="link-button" onClick={() => handleEdit(doc)}>Edit</button>
              <button className="link-button danger" onClick={() => handleDelete(doc._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDoctors;
