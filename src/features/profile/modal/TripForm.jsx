// TripForm.jsx

import React from "react";
import ImageUploader from "./ImageUploader"; // This is a default import
import DateRangePicker from "./DateRangePicker";
import useTripForm from "../hooks/useTripForm";
import "./trip.css";

const TripForm = ({
  onSubmit,
  initialValues = {},
  submitLabel = "Start Planning",
}) => {
  const { tripData, handleChange, handleFileChange, handleSubmit } =
    useTripForm(onSubmit, initialValues);

  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <h1 className="modal-heading">Trip Name</h1>
      <input
        type="text"
        name="name"
        value={tripData.name}
        onChange={handleChange}
        required
        placeholder="Give your trip a name.."
      />

      <DateRangePicker
        startDate={tripData.startDate}
        endDate={tripData.endDate}
        onChange={handleChange}
      />

      <h2 className="modal-heading">Trip Description</h2>
      <textarea
        name="description"
        value={tripData.description}
        onChange={handleChange}
        required
        placeholder="Write a short description of your trip..."
      />

      <ImageUploader
        imageUrl={tripData.imageUrl}
        imageFile={tripData.imageFile}
        onUrlChange={handleChange}
        onFileChange={handleFileChange}
      />

      <button type="submit" className="start-planning-btn">
        {submitLabel}
      </button>
    </form>
  );
};

export default TripForm;
