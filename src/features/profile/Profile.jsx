// ProfilePage.jsx
import { useOutletContext } from "react-router-dom";
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import useTrips from "../../hooks/useTrips";
import "../../components/Sidebar/sidebar.css";
import "./profile.css";
import UpcomingTrips from "./UpcomingTrips";
import PastTrips from "./PastTrips";

const Profile = () => {
  const { trips, setTrips } = useOutletContext();
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const { upcomingTrips, pastTrips } = useTrips(trips);

  const handleTripDeleted = (deletedId) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== deletedId));
  };

  console.log("Upcoming trips:", upcomingTrips);

  return (
    <div className="profile-container">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="profile-content">
        {selectedTab === "upcoming" ? (
          <UpcomingTrips trips={upcomingTrips} onDeleted={handleTripDeleted} />
        ) : (
          <PastTrips trips={pastTrips} onDeleted={handleTripDeleted} />
        )}
      </div>
    </div>
  );
};

export default Profile;
