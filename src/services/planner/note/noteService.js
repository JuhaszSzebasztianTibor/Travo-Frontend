// src/services/planner/noteService.js
import api from "../../../api/api";

const withAuthNote = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getNotesByPlace = (placeId) =>
  api.get(`/places/${placeId}/notes`, withAuthNote()).then((res) => res.data);

export const createNote = (placeId, noteDto) =>
  api
    .post(`/places/${placeId}/notes`, noteDto, {
      ...withAuthNote(),
      headers: {
        ...withAuthNote().headers,
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);

export const deleteNote = (placeId, noteId) =>
  api.delete(`/places/${placeId}/notes/${noteId}`, withAuthNote());
