// TripCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formDate";
import { deleteTrip } from "../../services/trips/tripService";
import DeleteTripForm from "./modal/DeleteTripForm";

export default function TripCard({ trip, onDeleted }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * Normalize trip.imageUrl into something <img> can consume:
   * - If it starts with http:// or https:// → return as-is
   * - If it starts with data: → return as-is
   * - Otherwise assume it's raw base64 → prefix with data:image/jpeg;base64,
   */
  const getImageSrc = (raw) => {
    if (!raw) return "";

    // strip any leading "/" so "/data:…" or "/9j/…" become "data:…" or "9j/…"
    const clean = raw.replace(/^\/+/, "");

    // HTTP(S)? → bail out
    if (/^https?:\/\//i.test(clean)) {
      return clean;
    }

    // Data-URI? → bail out
    if (/^data:/i.test(clean)) {
      return clean;
    }

    // Otherwise assume it’s raw base64 JPEG payload
    return `data:image/jpeg;base64,${clean}`;
  };

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

  useEffect(() => {
    console.log("RAW API JSON:", trip);
  }, [trip]);

  return (
    <>
      <div
        className="trip-card"
        onClick={() => navigate(`/trip/plan/${trip.id}`)}
      >
        <img
          src={getImageSrc(trip.imageUrl)}
          className="trip-image"
          alt={trip.tripName ? `Trip to ${trip.tripName}` : "Trip image"}
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
