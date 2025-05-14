// TripCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formDate";
import { deleteTrip } from "../../services/trips/tripService";
import DeleteTripForm from "./DeleteTripForm";

export default function TripCard({ trip, onDeleted }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteTrip(trip.id);
      onDeleted(trip.id);
      setShowModal(false);
    } catch (err) {
      setError("Failed to delete trip. Please try again later.");
    }
  };

  return (
    <>
      <div
        className="trip-card"
        onClick={() => navigate(`/trip/plan/${trip.id}`)}
      >
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
          {error && <p className="error-message">{error}</p>}
        </div>

        <button
          type="button"
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          aria-label="Delete trip"
        >
          <i className="fa fa-trash" />
        </button>
      </div>

      <DeleteTripForm
        showModal={showModal}
        setShowModal={setShowModal}
        tripName={trip.tripName}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
