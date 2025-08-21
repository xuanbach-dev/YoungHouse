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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [isMenuOpen]);

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
            <img src="/logo3.png" alt="YoungHouse" className="logo-image" />
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
          <span className="menu-label">Menu</span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-menu-header">
          <div className="brand-logo small">
            <img src="/logo3.png" alt="YoungHouse" className="logo-image" />
          </div>
          <button className="close-btn" aria-label="Đóng menu" onClick={() => setIsMenuOpen(false)}>
            ✕
          </button>
        </div>
        <div className="mobile-menu-body">
          <ul className="mobile-nav" role="menu">
            <li>
              <Link to="/" className="mobile-nav-item" role="menuitem" onClick={handleNavClick}>
                <span className="item-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" fill="currentColor"/>
                  </svg>
                </span>
                <span className="item-text">Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link to="/system-home" className="mobile-nav-item" role="menuitem" onClick={handleNavClick}>
                <span className="item-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h7v18H3V3zm11 0h7v10h-7V3zm0 12h7v6h-7v-6z" fill="currentColor"/>
                  </svg>
                </span>
                <span className="item-text">Hệ thống nhà trọ</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="mobile-nav-item" role="menuitem" onClick={handleNavClick}>
                <span className="item-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" fill="currentColor"/>
                  </svg>
                </span>
                <span className="item-text">Liên hệ</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="mobile-menu-footer">
          <div className="quick-actions">
            <a className="quick-action call" href="tel:0372858098" onClick={handleNavClick}>
              <img src="/phone-icon.png" alt="Gọi" />
              <span>Gọi ngay</span>
            </a>
            <a className="quick-action zalo" href="https://zalo.me/0372858098" target="_blank" rel="noreferrer" onClick={handleNavClick}>
              <img src="/Zalo.png" alt="Zalo" />
              <span>Chat Zalo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;