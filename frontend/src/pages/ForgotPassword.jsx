import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
      if (data.devResetUrl) {
        setMessage(`${data.message} (dev link: ${data.devResetUrl})`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Forgot password</h2>
        <p className="muted">Enter your email and we'll send you a reset link.</p>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
        <p className="auth-switch"><Link to="/login">Back to login</Link></p>
      </form>
    </div>
  );
};

export default ForgotPassword;