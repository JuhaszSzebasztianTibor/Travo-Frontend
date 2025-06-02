import api from "../../api/api";

// Authorization header to attach token
const withAuth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createTrip = async (tripData) => {
  const formData = new FormData();
  formData.append("TripName", tripData.name);
  formData.append("StartDate", new Date(tripData.startDate).toISOString());
  formData.append("EndDate", new Date(tripData.endDate).toISOString());
  formData.append("Description", tripData.description);

  if (tripData.imageFile) {
    formData.append("ImageFile", tripData.imageFile);
  } else if (tripData.imageUrl && tripData.imageUrl.trim() !== "") {
    formData.append("ImageUrl", tripData.imageUrl);
  }

  const res = await api.post("/trips", formData, withAuth());
  return res.data;
};

export const getTripById = async (tripId) => {
  const response = await api.get(`/trips/${tripId}`, withAuth());
  return response.data;
};

export const getMyTrips = async () => {
  const res = await api.get("/trips", withAuth());
  return res.data;
};

export const deleteTrip = async (id) => {
  await api.delete(`/trips/${id}`, withAuth());
};
