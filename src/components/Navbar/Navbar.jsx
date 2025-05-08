import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import travoLogo from "../../assets/Images/travo.png";
import Modal from "../Modal/Modal";
import CreateTripForm from "../../features/profile/modal/CreateTripForm";
import { isAuthenticated } from "../../utils/auth";

import "./navbar.css";
import "../../App.css";

const Navbar = ({ onCreateTrip }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(isAuthenticated());
    };
    window.addEventListener("authChange", updateAuthState);
    window.addEventListener("storage", updateAuthState);
    return () => {
      window.removeEventListener("authChange", updateAuthState);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        {/* Left */}
        <div className="navbar-segment navbar-left">
          <Link to="/" onClick={() => (window.location.href = "/")}>
            <img src={travoLogo} alt="Travo logo" />
          </Link>
          {!isLoggedIn && (
            <ul>
              <li className="highlight-link">
                <Link to="/about">About</Link>
              </li>
            </ul>
          )}
        </div>

        {/* Right */}
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
                    onClick={() => setIsModalOpen(true)}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* pass the parent callback directly */}
        <CreateTripForm
          onSubmit={(tripDto) => {
            onCreateTrip(tripDto);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
};

export default Navbar;
