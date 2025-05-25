// src/services/planner/placeService.js
import api from "../../../api/api";

const withAuth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getPlacesByDayPlan = (dayPlanId) =>
  api.get(`/dayplans/${dayPlanId}/places`, withAuth()).then((res) => res.data);

export const getPlacesByTrip = (tripId) =>
  api.get(`/trips/${tripId}/places`, withAuth()).then((res) => res.data);

export const createPlace = (dayPlanId, placeDto) =>
  api
    .post(`/dayplans/${dayPlanId}/places`, placeDto, {
      ...withAuth(),
      headers: { ...withAuth().headers, "Content-Type": "application/json" },
    })
    .then((res) => res.data);

export const deletePlace = (dayPlanId, placeId) =>
  api.delete(`/dayplans/${dayPlanId}/places/${placeId}`, withAuth());
