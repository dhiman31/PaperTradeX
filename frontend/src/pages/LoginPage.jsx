import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const [email, setEmail] = useState('');
  const [passwordHash, setpasswordHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: email.trim(), passwordHash });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

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
              Trade crypto.<br />
              No real money.<br />
              Full real experience.
            </h1>
            <p className="auth-left__sub">
              Practice with live market data. Your paper portfolio, your rules.
            </p>

            <div className="auth-chart" aria-hidden="true">
              <svg width="100%" viewBox="0 0 260 90" preserveAspectRatio="none">
                <polyline
                  points="0,70 30,55 55,62 80,38 110,45 140,20 170,28 200,14 260,22"
                  fill="none"
                  stroke="#F0B90B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="0,70 30,55 55,62 80,38 110,45 140,20 170,28 200,14 260,22 260,90 0,90"
                  fill="#F0B90B"
                  fillOpacity="0.06"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-right">
          <p className="auth-eyebrow">Account access</p>
          <h2 className="auth-heading">Welcome back</h2>
          <p className="auth-sub">Log in to track your portfolio and trade live.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="passwordHash">Password</label>
              <input
                id="passwordHash"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={passwordHash}
                onChange={(e) => setpasswordHash(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          {error && (
            <div className="auth-alert auth-alert--error" role="alert">
              {error}
            </div>
          )}

          <p className="auth-foot">
            No account yet?{' '}
            <Link to="/signup" className="auth-link">Sign up →</Link>
          </p>
        </div>

      </div>
    </div>
  );
}