// src/services/planner/destinations/destinationService.js
import api from "../../../api/api";

const withAuth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getTripDestinations = (tripId) =>
  api.get(`/trips/${tripId}/destinations`, withAuth()).then((res) => res.data);

export const createDestination = (tripId, dest) =>
  api
    .post(
      `/trips/${tripId}/destinations`,
      {
        name: dest.name,
        latitude: dest.lat,
        longitude: dest.lng,
        nights: dest.nights,
      },
      withAuth()
    )
    .then((res) => res.data);

export const deleteDestination = (tripId, id) =>
  api.delete(`/trips/${tripId}/destinations/${id}`, withAuth());

export const patchNights = (tripId, id, nights) =>
  api.patch(`/trips/${tripId}/destinations/${id}/nights`, nights, {
    ...withAuth(),
    headers: {
      ...withAuth().headers,
      "Content-Type": "application/json",
    },
  });
