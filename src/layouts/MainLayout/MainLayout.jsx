import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import * as tripService from "../../services/trips/tripService";
import "./mainLayout.css";

const MainLayout = () => {
  const [trips, setTrips] = useState([]);

  // load trips once when layout mounts
  useEffect(() => {
    tripService
      .getAllTrips()
      .then((rawTrips) => {
        const normalized = rawTrips.map((t) => ({
          id: t.id,
          tripName: t.tripName,
          startDate: t.startDate,
          endDate: t.endDate,
          description: t.description,
          imageUrl: t.image,
        }));
        setTrips(normalized);
      })
      .catch(console.error);
  }, []);

  // create new trip and prepend to trips
  const createTrip = async (dto) => {
    const newTrip = await tripService.createTrip(dto);

    // Normalize the newly created trip too:
    const normalized = {
      id: newTrip.id,
      tripName: newTrip.tripName,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      description: newTrip.description,
      imageUrl: newTrip.image,
    };

    setTrips((prev) => [normalized, ...prev]);

    return newTrip;
  };

  return (
    <>
      <Navbar onCreateTrip={createTrip} />
      <main className="main-layout-container">
        <Outlet context={{ trips, createTrip, setTrips }} />
      </main>
    </>
  );
};

export default MainLayout;
