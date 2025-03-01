import React from "react";
import { useNavigate } from "react-router-dom";
import travelImage from "../../assets/Images/home.jpg";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="content">
      <h1>Plan Your Perfect Trip with Travo</h1>
      <p>
        Say goodbye to travel stress! Travo helps you create personalized
        itineraries, find the best deals, and explore hidden gems. <br />
        Start planning your next adventure!
      </p>
      <div className="buttons">
        <button
          className="startplanning-btn"
          onClick={() => navigate("/login")}
        >
          Start planning
        </button>
      </div>
      <div
        className="home-image"
        style={{ backgroundImage: `url(${travelImage})` }}
      ></div>
    </div>
  );
};

export default Home;
