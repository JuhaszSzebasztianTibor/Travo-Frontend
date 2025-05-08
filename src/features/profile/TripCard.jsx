// TripCard.jsx
import React from "react";
import "./profile.css";
import { formatDate } from "../../utils/formDate";
import { deleteTrip } from "../../services/trips/tripService";

const TripCard = ({ trip, onDeleted }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await deleteTrip(trip.id);
      onDeleted(trip.id);
    } catch (err) {
      console.error("Failed to delete trip", err);
    }
  };

  return (
    <div className="trip-card">
      <img src={trip.imageUrl} className="trip-image" alt={trip.tripName} />
      <div className="trip-card-content">
        <div className="trip-card-header">
          <h3>{trip.tripName}</h3>
          <p className="trip-card-date">{formatDate(trip.startDate)}</p>
        </div>
        <p>{trip.description}</p>
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
