import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">DocBook</Link>
      <nav className="navbar-links">
        <Link to="/">Find a doctor</Link>
        {user && user.role === 'patient' && <Link to="/my-appointments">My appointments</Link>}
        {user && user.role === 'admin' && <Link to="/admin">Dashboard</Link>}
        {user && <Link to="/change-password">Change password</Link>}
        {!user && <Link to="/login">Log in</Link>}
        {!user && <Link to="/register" className="navbar-cta">Sign up</Link>}
        {user && (
          <button className="navbar-logout" onClick={handleLogout}>
            Log out
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;