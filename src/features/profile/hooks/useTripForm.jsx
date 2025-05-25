import { useState, useEffect } from "react";
import { isAuthenticated } from "../../../utils/auth";

export default function useTripForm(onSubmit, initialValues = {}) {
  const [tripData, setTripData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    imageUrl: "",
    imageFile: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialValues) {
      setTripData({
        name: initialValues.name || "",
        startDate: initialValues.startDate?.slice(0, 10) || "",
        endDate: initialValues.endDate?.slice(0, 10) || "",
        description: initialValues.description || "",
        imageUrl: (initialValues.imageUrl || "").replace(/^\/+/, ""),
        imageFile: null,
      });
    }
  }, [JSON.stringify(initialValues)]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTripData((prev) => ({
      ...prev,
      [name]: name === "imageUrl" ? value.replace(/^\/+/, "") : value,
    }));
  };

  const handleFileChange = (file) => {
    setTripData((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl: file ? "" : prev.imageUrl,
    }));
  };

  const validateDates = () => {
    if (!tripData.startDate || !tripData.endDate) {
      return "Both start and end dates are required";
    }
    if (new Date(tripData.startDate) > new Date(tripData.endDate)) {
      return "Start date cannot be after end date";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("You must be logged in to submit a trip.");
      setSubmitting(false);
      return;
    }

    const dateError = validateDates();
    if (dateError) {
      setError(dateError);
      setSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        ...tripData,
        startDate: tripData.startDate + "T00:00:00",
        endDate: tripData.endDate + "T23:59:59",
      });
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    tripData,
    handleChange,
    handleFileChange,
    handleSubmit,
    submitting,
    error,
  };
}
