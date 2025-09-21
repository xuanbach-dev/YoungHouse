import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(false);

  useEffect(() => {
    const flag = localStorage.getItem('yh_admin_auth') === 'true';
    setIsAdminAuthed(flag);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('yh_admin_auth');
    setIsAdminAuthed(false);
    navigate('/admin-login');
  };


  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <img src="/logo3.png" alt="YoungHouse" className="logo-image" />
          </div>
        </Link>

        {/* Desktop menu */}
        <div className="navbar-menu desktop-menu">
          <Link to="/" className={`navbar-item ${isActivePath('/') ? 'active' : ''}`}>
            <span>Trang chủ</span>
          </Link>

          <Link to="/system-home" className={`navbar-item ${isActivePath('/system-home') ? 'active' : ''}`}>
            <span>Hệ thống nhà trọ</span>
          </Link>
          <Link to="/roommate-finder" className={`navbar-item ${isActivePath('/roommate-finder') ? 'active' : ''}`}>
            <span>Tìm người ở ghép</span>
          </Link>

          <Link to="/contact" className={`navbar-item ${isActivePath('/contact') ? 'active' : ''}`}>
            <span>Liên hệ</span>
          </Link>

          
        </div>

        {/* Book Now Button */}
        <button
          className="book-now-button"
          onClick={() => navigate('/system-home')}
        >
          <span className="book-now-text">Đặt phòng ngay</span>
        </button>
      </div>

    </nav>
  );
};

export default Navbar;