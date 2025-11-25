import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "active" : "";
  };

  // const handlePracticeClick = (subject) => {
  //   navigate(`/practice/topic?subject=${encodeURIComponent(subject)}`);
  // };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="logo">PrepUp</Link>
      </div>  
      <div className="navbar-center">
        {isAuthenticated && (
          <div className="nav-links">
            <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
              Dashboard
            </Link>

            <Link to="/analytics" className={`nav-link ${isActive("/analytics")}`}>
              Analytics
            </Link>
          </div>
        )}
      </div>
      

      <div className="navbar-right">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn-login">Log In</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </>
        ) : (
          <>
            <div className="dropdown">
              <div className="user-profile dropdown-toggle" role="button" aria-haspopup="true" aria-expanded="false">
                <img src="https://i.pravatar.cc/40" alt="User Avatar" />
                <span>{currentUser?.fullName || "User"}</span>
                <FiChevronDown />
              </div>
              <div className="dropdown-menu" style={{ right: 0, left: "auto" }}>
                <Link to="/profile" className="dropdown-item">My Profile</Link>
                <Link to="/profile#settings" className="dropdown-item">Settings</Link>
                <button className="dropdown-item" onClick={logout} style={{ color: "#ef4444" }}>Logout</button>
              </div>
            </div>
          </>
        )}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <FiMenu />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
