import api from "../../api/api";

export const createTrip = async (tripData) => {
  const token = localStorage.getItem("token"); // Fetch the token from localStorage
  console.log("Token:", token); // Log the token to ensure it exists

  if (!token) {
    throw new Error("No token found. Please log in.");
  }

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

  for (let [key, val] of formData.entries()) {
    console.log("→ FormData field:", key, val);
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
      // The request was made, but the server responded with an error status
      console.error("Error response data:", error.response.data);
      console.error("Error status:", error.response.status);
    } else {
      // The request was made but no response was received
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const getAllTrips = () => {
  return api.get("/Trips").then((res) => {
    console.log("All trips response:", res.data); // Log to verify the structure
    return res.data;
  });
};

export const getMyTrips = () => {
  return api.get("/Trips/me").then((res) => res.data);
};

export const getTripById = async (tripId) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/Trips/${tripId}`);

  return response.data;
};

export const deleteTrip = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found.");
  }

  await api.delete(`/Trips/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
