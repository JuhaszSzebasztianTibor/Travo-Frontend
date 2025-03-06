import React, { useState } from "react";
import "./sidebar.css";

const Sidebar = () => {
  const [isDropupOpen, setIsDropupOpen] = useState(false); // State to manage dropdown visibility

  // Toggle dropdown visibility
  const toggleDropup = () => {
    setIsDropupOpen(!isDropupOpen);
  };

  // Close dropdown when clicking outside
  const closeDropup = (event) => {
    if (!event.target.closest(".dropup")) {
      setIsDropupOpen(false);
    }
  };

  // Add event listener to close dropdown when clicking outside
  React.useEffect(() => {
    document.addEventListener("click", closeDropup);
    return () => {
      document.removeEventListener("click", closeDropup);
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="image-placeholder"></div>
      <div className="user-name">Jeremy Ghilbert</div>
      <div className="search-container">
        <input type="text" className="search-bar" placeholder="Search.." />
        <i className="fa fa-search search-icon"></i>
      </div>
      <div className="sidebar-navigation-menu"></div>
      <div className="sidebar-bottom-action">
        <div className="dropup">
          <button className="dropbtn" onClick={toggleDropup}>
            <i className="fas fa-cog"></i> Settings
          </button>
          <div className={`dropup-content ${isDropupOpen ? "show" : ""}`}>
            <a href="#">Profile settings</a>
            <a href="#">Change password</a>
            <a href="#">Log out</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
