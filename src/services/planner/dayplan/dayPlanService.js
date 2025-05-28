import api from "../../../api/api";

const withAuth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/**
 * Fetch all day plans for a given trip
 */
export const getTripDayPlans = (tripId) =>
  api.get(`/trips/${tripId}/dayplans`, withAuth()).then((res) => res.data);

export const createDayPlan = (tripId, dayPlanDto) =>
  api
    .post(`/trips/${tripId}/dayplans`, dayPlanDto, {
      ...withAuth(),
      headers: {
        ...withAuth().headers,
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);
