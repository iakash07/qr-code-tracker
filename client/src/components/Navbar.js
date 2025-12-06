import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaQrcode, FaChartBar, FaPlus, FaList } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaQrcode className="brand-icon" />
          <span>QR Tracker</span>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <FaChartBar />
            <span>Dashboard</span>
          </Link>
          <Link to="/generate" className={`nav-link ${isActive('/generate')}`}>
            <FaPlus />
            <span>Generate</span>
          </Link>
          <Link to="/qr-codes" className={`nav-link ${isActive('/qr-codes')}`}>
            <FaList />
            <span>QR Codes</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
