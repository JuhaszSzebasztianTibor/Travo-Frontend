import api from "../../api/api";
import { logout } from "../auth/authService";

export const createTrip = async (tripData) => {
  const token = localStorage.getItem("token"); // Fetch the token from localStorage
  console.log("Token:", token); // Log the token to ensure it exists

  const formData = new FormData();
  formData.append("TripName", tripData.name);
  formData.append("StartDate", tripData.startDate);
  formData.append("EndDate", tripData.endDate);
  formData.append("Description", tripData.description);

  if (tripData.imageFile) {
    formData.append("ImageFile", tripData.imageFile); // Server will store the file and return a URL
  } else if (tripData.imageUrl) {
    formData.append("ImageUrl", tripData.imageUrl); // Optional fallback for raw URLs
  }

  try {
    const res = await api.post("/Trips", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error status:", error.response.status);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const getTripById = async (tripId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.get(`/Trips/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch trip:", error);
    throw error; // Propagate the error to be handled elsewhere
  }
};

export const getMyTrips = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const res = await api.get("/Trips", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTrip = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    await api.delete(`/Trips/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to the Authorization header
      },
    });
  } catch (error) {
    console.error("Failed to delete trip:", error);
    throw error; // Propagate the error to be handled elsewhere
  }
};
