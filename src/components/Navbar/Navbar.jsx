import { Link } from "react-router-dom";
import { useState } from "react";

import travoLogo from "../../assets/Images/travo.png";

import "./navbar.css";
import "../../App.css";

const Navbar = () => {
  const [isLogedIn, setIsLogedIn] = useState(true);

  const handleLogout = () => {
    setIsLogedIn(false);
  };

  return (
    <nav className="navbar">
      {/* Left Section: Logo & About */}
      <div className="navbar-segment navbar-left">
        <Link to="/" onClick={() => (window.location.href = "/")}>
          <img src={travoLogo} alt="Travo logo" />
        </Link>
        <ul>
          {!isLogedIn && (
            <li className="highlight-link">
              <Link to="/about">About</Link>
            </li>
          )}
        </ul>
      </div>

      {/* Right Section: Log in & Sign up */}
      <div className="navbar-segment navbar-right">
        <ul>
          {isLogedIn ? (
            <>
              <li>
                <button className="icon-btn">
                  <i className="fas fa-bell"></i>
                </button>
              </li>
              <li>
                <button className="icon-btn">
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
  );
};

export default Navbar;
