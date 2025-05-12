import React, { useState } from "react";
import "./profile.css";
import { formatDate } from "../../utils/formDate";
import { deleteTrip } from "../../services/trips/tripService";

const TripCard = ({ trip, onDeleted }) => {
  const [error, setError] = useState(null);

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTrip(trip.id);
      onDeleted(trip.id);
    } catch (err) {
      setError("Failed to delete trip. Please try again later.");
      console.error("Failed to delete trip", err);
    }
  };

  return (
    <div className="trip-card">
      <img
        src={trip.imageUrl}
        className="trip-image"
        alt={`Trip to ${trip.tripName}`}
      />
      <div className="trip-card-content">
        <div className="trip-card-header">
          <h3>{trip.tripName}</h3>
          <p className="trip-card-date">{formatDate(trip.startDate)}</p>
        </div>
        <p>{trip.description}</p>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message if any */}
      </div>
      <button
        className="delete-btn"
        onClick={handleDelete}
        aria-label="Delete trip"
      >
        <i className="fa fa-trash"></i>
      </button>
    </div>
  );
};

export default TripCard;
