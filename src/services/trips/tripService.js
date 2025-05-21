import api from "../../api/api";
import { logout } from "../auth/authService";

// Authorization header to attach token
const withAuth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createTrip = async (tripData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please log in.");
    throw new Error("No token found. Please log in.");
  }
  console.log("Token:", token);

  const formData = new FormData();
  // Append necessary fields to FormData
  formData.append("TripName", tripData.name);
  formData.append("StartDate", new Date(tripData.startDate).toISOString());
  formData.append("EndDate", new Date(tripData.endDate).toISOString());
  formData.append("Description", tripData.description);

  // Handle image input: check if it's a file or URL
  if (tripData.imageFile) {
    console.log("Appending image file:", tripData.imageFile);
    formData.append("ImageFile", tripData.imageFile);
  } else if (tripData.imageUrl && tripData.imageUrl.trim() !== "") {
    // Only append ImageUrl if it's not an empty string
    console.log("Appending image URL:", tripData.imageUrl);
    formData.append("ImageUrl", tripData.imageUrl);
  } else {
    console.error("Either ImageFile or ImageUrl is required.");
    throw new Error("Either ImageFile or ImageUrl is required.");
  }

  try {
    const res = await api.post("/Trips", formData, withAuth());
    return res.data; // Return response data on success
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error status:", error.response.status);
      if (error.response.status === 400) {
        console.error(
          "Validation errors:",
          JSON.stringify(error.response.data.errors, null, 2)
        );
      }
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const getTripById = async (tripId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const response = await api.get(`/Trips/${tripId}`, withAuth());
    return response.data;
  } catch (error) {
    console.error("Failed to fetch trip:", error);
    throw error; // Propagate the error to be handled elsewhere
  }
};

export const getMyTrips = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated. Please log in.");
  }

  try {
    const res = await api.get("/Trips", withAuth());
    console.log("Fetched trips:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    throw error; // Propagate the error to be handled elsewhere
  }
};

export const deleteTrip = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    await api.delete(`/Trips/${id}`, withAuth());
  } catch (error) {
    console.error("Failed to delete trip:", error);
    throw error; // Propagate the error to be handled elsewhere
  }
};
