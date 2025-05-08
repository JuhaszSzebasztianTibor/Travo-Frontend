// CreateTripForm.js
import React from "react";
import useTripForm from "../hooks/useTripForm";
import DateRangePicker from "./DateRangePicker";
import ImageUploader from "./ImageUploader";
import "./trip.css";

const CreateTripForm = ({ onSubmit }) => {
  const { tripData, handleChange, handleFileChange, handleSubmit } =
    useTripForm(onSubmit);

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
        placeholder="Write a short description of your trip..."
        required
      />

      <ImageUploader
        imageUrl={tripData.imageUrl}
        imageFile={tripData.imageFile}
        onUrlChange={handleChange}
        onFileChange={handleFileChange}
        // disable URL input if a file is selected
        urlDisabled={!!tripData.imageFile}
        // disable file input if a URL is present
        fileDisabled={!!tripData.imageUrl}
      />

      <button type="submit" className="start-planning-btn">
        Start Planning
      </button>
    </form>
  );
};

export default CreateTripForm;
