import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TripForm from "./TripForm";
import { getTripById } from "../../services/tripService";
import axios from "axios";

const EditTripPage = () => {
  const { tripId } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const trip = await getTripById(tripId);

        if (!trip) {
          setError("Trip not found");
          return;
        }

        setInitialValues({
          name: trip.TripName || "",
          startDate: trip.StartDate ? trip.StartDate.slice(0, 10) : "",
          endDate: trip.EndDate ? trip.EndDate.slice(0, 10) : "",
          description: trip.Description || "",
          imageUrl: trip.imageUrl || "",
          imageFile: null,
        });
      } catch (error) {
        console.error("Error fetching trip:", error);
        setError("Failed to load trip data");
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleSubmit = async (formData) => {
    const form = new FormData();
    form.append("TripName", formData.name);
    form.append("StartDate", formData.startDate);
    form.append("EndDate", formData.endDate);
    form.append("Description", formData.description);

    if (formData.imageFile) {
      form.append("ImageFile", formData.imageFile);
    } else {
      form.append("ImageUrl", formData.imageUrl);
    }

    try {
      await axios.put(`/api/trips/${tripId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });
      navigate(`/trip/profile/${tripId}`, {
        state: { refresh: true }, // Optional: Add refresh state
      });
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update trip. Please try again.");
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!initialValues) return <div>Loading...</div>;

  return (
    <TripForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      submitLabel="Update Trip"
    />
  );
};

export default EditTripPage;
