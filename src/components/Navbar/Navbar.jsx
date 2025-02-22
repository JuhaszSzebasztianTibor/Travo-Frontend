import { Link } from "react-router-dom";
import travoLogo from "../../assets/Images/travonav.png";
import "./navbar.css";
import "../../App.css";
import { useState } from "react";

/*const isLoggedIn(setUserState(), userState) = useState(false);*/

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left Section: Logo & About */}
      <div className="navbar-segment navbar-left">
        <Link to="/" onClick={() => (window.location.href = "/")}>
          <img src={travoLogo} alt="Travo logo" />
        </Link>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>

      {/* Right Section: Log in & Sign up */}
      <div className="navbar-segment navbar-right">
        <ul>
          <li>
            <Link to="/signup">Sign up</Link>
          </li>
          <li>
            <Link to="/login">Log in</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
