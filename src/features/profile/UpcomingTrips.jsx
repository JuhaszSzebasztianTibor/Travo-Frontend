// UpcomingTrips.jsx
import React from "react";
import { Link } from "react-router-dom";
import TripCard from "./TripCard";

export default function UpcomingTrips({ trips, onDeleted }) {
  return (
    <>
      <h2>Upcoming Trips</h2>
      <div className="trip-cards-container">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <Link
              key={trip.id}
              to={`/trip/plan/${trip.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <TripCard trip={trip} onDeleted={onDeleted} />
            </Link>
          ))
        ) : (
          <p>No upcoming trips</p>
        )}
      </div>
    </>
  );
}
