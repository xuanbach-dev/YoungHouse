import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const flag = localStorage.getItem('yh_admin_auth') === 'true';
    setIsAdminAuthed(flag);
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('yh_admin_auth');
    setIsAdminAuthed(false);
    navigate('/admin-login');
  };

  const handleNavClick = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={handleNavClick}>
          <div className="brand-logo">
            <img src="/logo.png" alt="YoungHouse" className="logo-image" />
          </div>
        </Link>

        {/* Desktop menu */}
        <div className="navbar-menu desktop-menu">
          <Link to="/" className="navbar-item">
            <span>Trang chủ</span>
          </Link>

          <Link to="/system-home" className="navbar-item">
            <span>Hệ thống nhà trọ</span>
          </Link>

          <Link to="/contact" className="navbar-item">
            <span>Liên hệ</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          aria-label="Mở menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(v => !v)}
        >
          <span className="hamburger" />
          <span className="sr-only">Menu</span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-menu-header">
          <div className="brand-logo small">
            <img src="/logo.png" alt="YoungHouse" className="logo-image" />
          </div>
          <button className="close-btn" aria-label="Đóng menu" onClick={() => setIsMenuOpen(false)}>
            ✕
          </button>
        </div>
        <div className="mobile-menu-body">
          <Link to="/" className="navbar-item" onClick={handleNavClick}>
            Trang chủ
          </Link>
          <Link to="/system-home" className="navbar-item" onClick={handleNavClick}>
            Hệ thống nhà trọ
          </Link>
          <Link to="/contact" className="navbar-item" onClick={handleNavClick}>
            Liên hệ
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;