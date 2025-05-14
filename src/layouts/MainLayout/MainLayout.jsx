import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { isAuthenticated } from "../../utils/auth";
import {
  getMyTrips,
  createTrip as createTripService,
} from "../../services/trips/tripService";

export default function MainLayout() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [auth, setAuth] = useState(isAuthenticated());

  // wrap the fetch in useCallback so we can call it repeatedly
  const loadTrips = useCallback(async () => {
    if (!isAuthenticated()) {
      setTrips([]);
      return;
    }
    try {
      const raw = await getMyTrips();
      const normalized = raw.map((t) => ({
        id: t.id,
        tripName: t.tripName,
        startDate: t.startDate,
        endDate: t.endDate,
        description: t.description,
        imageUrl: t.image,
      }));
      setTrips(normalized);
    } catch (err) {
      console.error("Failed to load trips:", err);
      setTrips([]);
    }
  }, []);

  // 1) initial load, 2) reload on auth changes
  useEffect(() => {
    loadTrips();
    const onAuth = () => {
      setAuth(isAuthenticated());
      loadTrips();
    };
    window.addEventListener("authChange", onAuth);
    return () => window.removeEventListener("authChange", onAuth);
  }, [loadTrips]);

  // createTrip now reloads automatically after success
  const createTrip = async (dto) => {
    const newTrip = await createTripService(dto);
    await loadTrips();
    return newTrip;
  };

  // you already remove trips on delete via outlet context's onDeleted

  const editTrip = (tripId) => {
    setSelectedTrip(trips.find((t) => t.id === tripId) || null);
  };

  return (
    <>
      <Navbar onCreateTrip={createTrip} onEditTrip={editTrip} />
      <main className="main-layout-container">
        <Outlet
          context={{ trips, createTrip, editTrip, selectedTrip, setTrips }}
        />
      </main>
    </>
  );
}
