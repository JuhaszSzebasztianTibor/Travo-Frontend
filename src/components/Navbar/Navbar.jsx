import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import travoLogo from "../../assets/Images/travo.png";
import Modal from "../Modal/Modal";
import CreateTripForm from "../../features/trips/components/modal/CreateTripForm";
import { isAuthenticated } from "../../utils/auth";
import { logout } from "../../services/auth/authService";

import "./navbar.css";
import "../../App.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isModalOpen, SetIsModalOpen] = useState(false);

  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(isAuthenticated());
    };

    // Listen for custom login/logout events
    window.addEventListener("authChange", updateAuthState);

    // Also catch storage changes (multi-tab logout)
    window.addEventListener("storage", updateAuthState);

    return () => {
      window.removeEventListener("authChange", updateAuthState);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        {/* Left Section: Logo & About */}
        <div className="navbar-segment navbar-left">
          <Link to="/" onClick={() => (window.location.href = "/")}>
            <img src={travoLogo} alt="Travo logo" />
          </Link>
          <ul>
            {!isLoggedIn && (
              <li className="highlight-link">
                <Link to="/about">About</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Section: Log in & Sign up */}
        <div className="navbar-segment navbar-right">
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  <button className="nav-btn notification-btn">
                    <i className="fas fa-bell"></i>
                  </button>
                </li>
                <li>
                  <button
                    className="nav-btn"
                    onClick={() => SetIsModalOpen(true)}
                  >
                    <i className="fas fa-plus"></i> Add
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="highlight-link">
                  <Link to="/login">Log in</Link>
                </li>
                <li className="highlight-link">
                  <Link to="/signup">Sign up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <Modal isOpen={isModalOpen} onClose={() => SetIsModalOpen(false)}>
        <CreateTripForm />
      </Modal>
    </>
  );
};

export default Navbar;
