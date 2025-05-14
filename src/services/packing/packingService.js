// src/services/packing/packingService.js
import api from "../../api/api";

const withAuth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// GET all lists for a trip
export const getPackingLists = (tripId) =>
  api.get(`/trips/${tripId}/packing`, withAuth()).then((res) => res.data);

// CREATE a new list under a trip
export const createPackingList = (tripId, dto) =>
  api.post(`/trips/${tripId}/packing`, dto, withAuth()).then((res) => res.data);

// UPDATE a list
export const renamePackingList = (tripId, listId, dto) =>
  api.put(`/trips/${tripId}/packing/${listId}`, dto, withAuth());

// DELETE a list
export const deletePackingList = (tripId, listId) =>
  api.delete(`/trips/${tripId}/packing/${listId}`, withAuth());

// ITEM ops
export const addPackingItem = (tripId, listId, dto) =>
  api
    .post(`/trips/${tripId}/packing/${listId}/items`, dto, withAuth())
    .then((res) => res.data);

export const updatePackingItem = (tripId, listId, itemId, dto) =>
  api.patch(
    `/trips/${tripId}/packing/${listId}/items/${itemId}`,
    dto,
    withAuth()
  );

export const removePackingItem = (tripId, listId, itemId) =>
  api.delete(`/trips/${tripId}/packing/${listId}/items/${itemId}`, withAuth());

// TEMPLATES (SYSTEM)
export const getPackingTemplates = (tripId) =>
  api
    .get(`/trips/${tripId}/packing/templates`, withAuth())
    .then((res) => res.data.templates);
