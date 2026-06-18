import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    passwordHash: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register({
        firstName: fields.firstName.trim(),
        lastName: fields.lastName.trim(),
        email: fields.email.trim(),
        phoneNumber: fields.phoneNumber.trim(),
        passwordHash: fields.passwordHash,
      });
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">

        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-logo">
            <div className="auth-logo__mark">
              <svg viewBox="0 0 20 20" fill="#0b0e11" width="18" height="18">
                <polygon points="10,2 12.5,7.5 18,8.5 14,12.5 15,18 10,15.5 5,18 6,12.5 2,8.5 7.5,7.5" />
              </svg>
            </div>
            <span className="auth-logo__name">PaperTradeX</span>
          </div>

          <div className="auth-left__body">
            <h1 className="auth-left__heading">
              Start trading<br />
              smarter today.
            </h1>
            <p className="auth-left__sub">
              Paper trade with live market data. Zero risk, real skills.
            </p>

            <ul className="auth-features">
              <li>
                <span className="auth-features__dot" />
                Live prices from Binance WebSocket
              </li>
              <li>
                <span className="auth-features__dot" />
                Real order matching engine
              </li>
              <li>
                <span className="auth-features__dot" />
                Portfolio tracking &amp; P&amp;L charts
              </li>
              <li>
                <span className="auth-features__dot" />
                No real money needed
              </li>
            </ul>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-right">
          <p className="auth-eyebrow">Get started</p>
          <h2 className="auth-heading">Create your account</h2>
          <p className="auth-sub">Sign up to start trading on paper with live prices.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field-row">
              <div className="auth-field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  placeholder="First"
                  value={fields.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  placeholder="Last"
                  value={fields.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={fields.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                id="phoneNumber"
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={fields.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="passwordHash">Password</label>
              <input
                id="passwordHash"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={fields.passwordHash}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {error && (
            <div className="auth-alert auth-alert--error" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="auth-alert auth-alert--success" role="status">
              {success}
            </div>
          )}

          <p className="auth-foot">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Log in →</Link>
          </p>
        </div>

      </div>
    </div>
  );
}