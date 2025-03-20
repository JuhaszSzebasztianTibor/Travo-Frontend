import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../../components/Sidebar/sidebar.css";
import "./profile.css";

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");

  return (
    <div className="profile-container">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="profile-content">
        {selectedTab === "upcoming" && <UpcomingTrips />}
        {selectedTab === "past" && <PastTrips />}
      </div>
    </div>
  );
};

const UpcomingTrips = () => {
  const upcomingTrips = [
    {
      id: 1,
      destination: "Paris",
      date: "2025-06-15",
      description:
        "A wonderful trip to the City of Lights. Explore Eiffel Tower and more!",
      image: "https://source.unsplash.com/400x250/?paris",
    },
    {
      id: 2,
      destination: "Tokyo",
      date: "2025-07-20",
      description: "Experience the fusion of tradition and modernity in Japan!",
      image: "https://source.unsplash.com/400x250/?tokyo",
    },
  ];

  return (
    <div>
      <h2>Upcoming Trips</h2>
      <div className="trip-cards-container">
        {upcomingTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

const PastTrips = () => {
  const pastTrips = [
    {
      id: 1,
      destination: "New York",
      date: "2024-11-30",
      description: "Had an amazing time exploring the Big Apple!",
      image: "https://source.unsplash.com/400x250/?new-york",
    },
    {
      id: 2,
      destination: "London",
      date: "2024-09-10",
      description: "Visited the British Museum, Tower of London, and more!",
      image:
        "https://c4.wallpaperflare.com/wallpaper/419/725/96/city-street-london-bus-wallpaper-thumb.jpg",
    },
    {
      id: 3,
      destination: "London",
      date: "2024-09-10",
      description: "Visited the British Museum, Tower of London, and more!",
      image:
        "https://c4.wallpaperflare.com/wallpaper/419/725/96/city-street-london-bus-wallpaper-thumb.jpg",
    },
    {
      id: 4,
      destination: "London",
      date: "2024-09-10",
      description: "Visited the British Museum, Tower of London, and more!",
      image:
        "https://c4.wallpaperflare.com/wallpaper/419/725/96/city-street-london-bus-wallpaper-thumb.jpg",
    },
    {
      id: 5,
      destination: "London",
      date: "2024-09-10",
      description: "Visited the British Museum, Tower of London, and more!",
      image:
        "https://c4.wallpaperflare.com/wallpaper/419/725/96/city-street-london-bus-wallpaper-thumb.jpg",
    },
    {
      id: 2,
      destination: "London",
      date: "2024-09-10",
      description: "Visited the British Museum, Tower of London, and more!",
      image:
        "https://c4.wallpaperflare.com/wallpaper/419/725/96/city-street-london-bus-wallpaper-thumb.jpg",
    },
    {
      id: 6,
      destination: "London",
      date: "2024-09-10",
      description: "Visited the British Museum, Tower of London, and more!",
      image:
        "https://c4.wallpaperflare.com/wallpaper/419/725/96/city-street-london-bus-wallpaper-thumb.jpg",
    },
  ];

  return (
    <div>
      <h2>Past Trips</h2>
      <div className="trip-cards-container">
        {pastTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

const TripCard = ({ trip }) => {
  return (
    <div className="trip-card">
      <img src={trip.image} alt={trip.destination} className="trip-image" />
      <div className="trip-card-content">
        <div className="trip-card-header">
          <h3>{trip.destination}</h3>
          <p>{trip.date}</p>
        </div>
        <p>{trip.description}</p>
      </div>
    </div>
  );
};

export default Profile;
