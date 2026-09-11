import { useEffect, useState } from 'react';
import api from '../api/axios';
import DoctorCard from '../components/DoctorCard';
import Loader from '../components/Loader';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/doctors', {
          params: {
            search: search || undefined,
            specialty: specialty || undefined,
            page,
            limit: 6,
          },
        });
        setDoctors(data.doctors);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [search, specialty, page]);

  return (
    <div className="page">
      <section className="hero">
        <h1>Find the right doctor, book in minutes</h1>
        <p>Search by name or specialty and pick a time that works for you.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search doctors or specialties..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <input
            type="text"
            placeholder="Filter by specialty (e.g. Dermatology)"
            value={specialty}
            onChange={(e) => { setSpecialty(e.target.value); setPage(1); }}
          />
        </div>
      </section>

      {loading && <Loader />}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && doctors.length === 0 && (
        <p className="empty-state">No doctors match your search yet — try a different specialty.</p>
      )}

      <div className="doctor-grid">
        {doctors.map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Home;
