import { Link } from 'react-router-dom';

const AdminDashboard = () => (
  <div className="page">
    <h1>Admin dashboard</h1>
    <div className="admin-links">
      <Link className="panel admin-link" to="/admin/doctors">Manage doctors</Link>
      <Link className="panel admin-link" to="/admin/appointments">Manage appointments</Link>
    </div>
  </div>
);

export default AdminDashboard;
