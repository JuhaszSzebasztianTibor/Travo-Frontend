// UpcomingTrips.jsx
import React from "react";
import { Link } from "react-router-dom";
import TripCard from "./TripCard";

export default function UpcomingTrips({ trips, onDeleted }) {
  return (
    <>
      <h2>Past Trips</h2>
      <div className="trip-cards-container">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDeleted={onDeleted} />
          ))
        ) : (
          <p>No upcoming trips</p>
        )}
      </div>
    </>
  );
}
