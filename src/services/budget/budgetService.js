import api from "../../api/api";

const withAuth = (headers) => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    ...headers,
  },
});

// Fetch all budgets for a given trip
export const getTripBudgets = (tripId) =>
  api.get(`/trips/${tripId}/budgets`, withAuth()).then((res) => res.data);

// Create a new budget under a trip
export const createBudget = (tripId, dto) =>
  api.post(`/trips/${tripId}/budgets`, dto, withAuth()).then((res) => res.data);

// Update an existing budget
export const updateBudget = (tripId, id, dto) =>
  api
    .put(`/trips/${tripId}/budgets/${id}`, dto, withAuth())
    .then((res) => res.data);

// Delete a budget
export const deleteBudget = (tripId, id) =>
  api
    .delete(`/trips/${tripId}/budgets/${id}`, withAuth())
    .then((res) => res.data);
