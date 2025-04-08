import { tripsData } from "./data/trips";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import useTrips from "../../hooks/useTrips";
import "../../components/Sidebar/sidebar.css";
import "./profile.css";
import UpcomingTrips from "./UpcomingTrips";
import PastTrips from "./PastTrips";

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [allTrips, setAllTrips] = useState([]); // To store trips dynamically

  const trips = tripsData;

  useEffect(() => {
    setAllTrips(trips); // Load trips into state
  }, []);

  const { upcomingTrips, pastTrips } = useTrips(allTrips);
  return (
    <div className="profile-container">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="profile-content">
        {selectedTab === "upcoming" && <UpcomingTrips trips={upcomingTrips} />}
        {selectedTab === "past" && <PastTrips trips={pastTrips} />}
      </div>
    </div>
  );
};

export default Profile;
