import React from "react";
import "./home.css";
import travelImage from "../../assets/Images/home.jpg";

const Home = () => {
  return (
    <div className="content">
      <h1>Plan Your Perfect Trip with Travo</h1>
      <p>
        Say goodbye to travel stress! Travo helps you create personalized
        itineraries, find the best deals, and explore hidden gems. <br />
        Start planning your next adventure!
      </p>
      <div className="buttons">
        <button className="startplanning-btn"> Start planning</button>
      </div>
      <div
        className="image"
        style={{ backgroundImage: `url(${travelImage})` }}
      ></div>
    </div>
  );
};

export default Home;
