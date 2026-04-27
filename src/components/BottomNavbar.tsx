import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavbar.css';

const BottomNavbar: React.FC = () => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      path: '/',
      label: 'Trang chủ',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" fill="currentColor"/>
        </svg>
      )
    },
    {
      path: '/system-home',
      label: 'Nhà trọ',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3h7v18H3V3zm11 0h7v10h-7V3zm0 12h7v6h-7v-6z" fill="currentColor"/>
        </svg>
      )
    },
    {
      path: '/about',
      label: 'Về chúng tôi',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <nav className="bottom-navbar">
      <div className="bottom-navbar-container">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActivePath(item.path) ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon">
              {item.icon}
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;
