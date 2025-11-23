import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiBell, FiChevronDown, FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="logo" style={{ textDecoration: 'none' }}>PrepUP</Link>
        <div className="nav-links">
          <Link to="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/dashboard" className={isActive("/practice")}>
            Practice
          </Link>
          <Link to="/profile" className={isActive("/profile")}>
            Profile
          </Link>
        </div>
      </div>
      <div className="navbar-right">
        <div className="streak">🔥 15 D</div>
        <Link to="/profile" className="user-profile" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <img src="https://i.pravatar.cc/40" alt="User Avatar" />
          <span>John Doe</span>
          <FiChevronDown />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
