import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, Home, MessageSquare, LogOut, HeartPulse } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-brand">
          <Heart size={28} />
          <span>CampusMind</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Home size={20} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Dashboard
          </NavLink>
          <NavLink to="/vent" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <MessageSquare size={20} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Vent Area
          </NavLink>
          <NavLink to="/guide" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <HeartPulse size={20} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Support Guide
          </NavLink>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
