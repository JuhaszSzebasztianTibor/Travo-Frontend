// src/hooks/useTripForm.js
import { useState } from "react";
import { isAuthenticated } from "../../../utils/auth";

export default function useTripForm(onSubmit) {
  const [tripData, setTripData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    imageUrl: "",
    imageFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setTripData((prev) => ({ ...prev, imageFile: file }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      alert("You must be logged in to create a trip.");
      return;
    }

    if (new Date(tripData.startDate) > new Date(tripData.endDate)) {
      alert("Start date cannot be after end date");
      return;
    }

    const payload = {
      name: tripData.name,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      description: tripData.description,
      imageFile: tripData.imageFile,
      imageUrl: tripData.imageUrl,
    };

    try {
      // Delegate creation (and setTrips) to the onSubmit passed in
      await onSubmit(payload);

      // Reset form after successful creation
      setTripData({
        name: "",
        startDate: "",
        endDate: "",
        description: "",
        imageUrl: "",
        imageFile: null,
      });
    } catch (err) {
      const data = err.response?.data;
      console.error("Full error response:", data);

      if (data?.errors) {
        console.group("Server validation errors");
        Object.entries(data.errors).forEach(([field, msgs]) =>
          console.warn(field, msgs)
        );
        console.groupEnd();

        const [firstField, firstMsgs] = Object.entries(data.errors)[0];
        alert(`${firstField}: ${firstMsgs[0]}`);
      } else {
        alert(data?.title || data?.message || "Could not create trip");
      }
    }
  };

  return {
    tripData,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
}
