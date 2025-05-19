import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth/authService";
import PhotoUploadForm from "../../services/auth/PhotoUploadForm";
import "./sidebar.css";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const [isDropupOpen, setIsDropupOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

  useEffect(() => {
    document.addEventListener("click", closeDropup);
    return () => {
      document.removeEventListener("click", closeDropup);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to login page
  };

  const handleUploaded = (newUrl) => {
    // update state and localStorage
    setUser((u) => ({ ...u, photoUrl: newUrl }));
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({ ...stored, photoUrl: newUrl })
    );
  };

  return (
    <div className="sidebar">
      <div
        className="image-placeholder"
        style={{
          backgroundImage: `url(${
            user?.photoUrl
              ? `https://localhost:7196${user.photoUrl}`
              : "/upload-user.png"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={() => setModalOpen(true)}
      />

      <PhotoUploadForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUploaded={handleUploaded}
      />

      <div className="user-name">
        {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
      </div>

      <div className="search-container">
        <input type="text" className="search-bar" placeholder="Search.." />
        <i className="fa fa-search search-icon"></i>
      </div>

      <div className="sidebar-navigation-menu">
        <button
          onClick={() => setSelectedTab("upcoming")}
          className={`sidebar-btn ${
            selectedTab === "upcoming" ? "active" : ""
          }`}
        >
          Upcoming Trips
        </button>
        <button
          onClick={() => setSelectedTab("past")}
          className={`sidebar-btn ${selectedTab === "past" ? "active" : ""}`}
        >
          Past Trips
        </button>
      </div>

      <div className="sidebar-bottom-action">
        <div className="dropup">
          <button className="dropbtn" onClick={toggleDropup}>
            <i className="fas fa-cog"></i> Settings
          </button>
          <div className={`dropup-content ${isDropupOpen ? "show" : ""}`}>
            <a href="#">Profile settings</a>
            <a onClick={handleLogout}>Log out</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
