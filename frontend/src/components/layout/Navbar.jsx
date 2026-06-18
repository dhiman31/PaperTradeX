import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/navbar.css';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`;

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__brand-dot" />
        <span className="navbar__brand-text">PaperTradeX</span>
      </div>

      <div className="navbar__links">
        <NavLink to="/" className={linkClass} end>
          Home
        </NavLink>
        <NavLink to="/market" className={linkClass}>
          Market
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/orders" className={linkClass}>
            Orders
          </NavLink>
        )}
      </div>

      <div className="navbar__actions">
        {isAuthenticated ? (
          <button className="navbar__btn navbar__btn--ghost" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login" className="navbar__btn navbar__btn--text">
              Login
            </NavLink>
            <NavLink to="/signup" className="navbar__btn navbar__btn--solid">
              Sign up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}