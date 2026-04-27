import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, LogOut, User, X } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin password from env or default
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'younghouse2024';

  useEffect(() => {
    const flag = sessionStorage.getItem('admin_authenticated') === 'true';
    setIsAdminAuthed(flag);
  }, [location.pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAdminAuthed(true);
      setAuthError('');
      sessionStorage.setItem('admin_authenticated', 'true');
      setShowLoginModal(false);
      setPassword('');
    } else {
      setAuthError('Mật khẩu không đúng');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAdminAuthed(false);
    if (location.pathname === '/admin') {
      navigate('/');
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
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

            <Link to="/about" className={`navbar-item ${isActivePath('/about') ? 'active' : ''}`}>
              <span>Về chúng tôi</span>
            </Link>

            <Link to="/contact" className={`navbar-item ${isActivePath('/contact') ? 'active' : ''}`}>
              <span>Liên hệ</span>
            </Link>

            {isAdminAuthed && (
              <Link to="/admin" className={`navbar-item ${isActivePath('/admin') ? 'active' : ''}`}>
                <User size={18} />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right side buttons */}
          <div className="navbar-actions">
            {isAdminAuthed ? (
              <button
                className="admin-logout-button"
                onClick={handleLogout}
                title="Đăng xuất"
              >
                <LogOut size={18} />
                <span className="admin-button-text">Đăng xuất</span>
              </button>
            ) : (
              <button
                className="admin-login-button"
                onClick={() => setShowLoginModal(true)}
                title="Đăng nhập Admin"
              >
                <Lock size={18} />
                <span className="admin-button-text">Admin</span>
              </button>
            )}

            {/* Book Now Button */}
            <button
              className="book-now-button"
              onClick={() => navigate('/system-home')}
            >
              <span className="book-now-text">Đặt phòng ngay</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="admin-login-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="admin-login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-login-modal-header">
              <h3>Đăng nhập Admin</h3>
              <button
                className="admin-login-modal-close"
                onClick={() => {
                  setShowLoginModal(false);
                  setPassword('');
                  setAuthError('');
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLogin} className="admin-login-form">
              {authError && (
                <div className="admin-login-error">
                  {authError}
                </div>
              )}

              <div className="admin-login-form-group">
                <label htmlFor="admin-password">
                  <Lock size={18} />
                  Mật khẩu
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Nhập mật khẩu admin"
                  autoFocus
                  required
                />
              </div>

              <div className="admin-login-form-actions">
                <button
                  type="button"
                  className="admin-login-cancel"
                  onClick={() => {
                    setShowLoginModal(false);
                    setPassword('');
                    setAuthError('');
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="admin-login-submit">
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;