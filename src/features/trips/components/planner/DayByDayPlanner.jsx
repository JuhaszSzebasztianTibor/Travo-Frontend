// src/features/trips/components/planner/DayByDayPlanner.jsx
import React, { useState, useEffect } from "react";
import { format, parseISO, addDays } from "date-fns";
import { GENERAL_PLACE_TYPES } from "./data/generalPlaceTypes";
import "./dayByDay.css";

import {
  getPlacesByDayPlan,
  createPlace,
  deletePlace,
} from "../../../../services/planner/places/placeService";
import {
  getNotesByPlace,
  createNote,
  deleteNote,
} from "../../../../services/planner/note/noteService";

export default function DayByDayPlanner({
  dayPlanId,
  destinations,
  startDate,
  onPlaceAdded,
  onPlaceDeleted,
}) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [dayDetails, setDayDetails] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  // Build days list
  const parsedStart = startDate ? parseISO(startDate) : new Date();
  const days = [];
  let cursor = parsedStart;
  let idx = 1;
  destinations.forEach((d) => {
    for (let i = 0; i < d.nights; i++) {
      days.push({
        id: idx++,
        date: format(addDays(cursor, i), "EEEE, do MMMM yyyy"),
        location: d.name,
      });
    }
    cursor = addDays(cursor, d.nights);
  });

  // Load existing places for this day plan
  useEffect(() => {
    if (!dayPlanId) return;
    (async () => {
      const all = await getPlacesByDayPlan(dayPlanId);
      const byDay = {};
      all.forEach((pl, origIdx) => {
        const dn = pl.dayNumber || 1;
        if (!byDay[dn]) {
          byDay[dn] = {
            places: [],
            newType: GENERAL_PLACE_TYPES[0].label,
            newName: "",
            newTime: "",
          };
        }
        byDay[dn].places.push({ ...pl, newNote: "", origIdx });
      });
      setDayDetails(byDay);
    })().catch(console.error);
  }, [dayPlanId]);

  // Initialize detail state for a given day
  const initDetail = (dayId) => {
    const existing = dayDetails[dayId] || {};
    const places = (existing.places || []).map((p) => ({
      ...p,
      newNote: p.newNote || "",
    }));
    return {
      places,
      newType: GENERAL_PLACE_TYPES[0].label,
      newName: "",
      newTime: "",
      ...existing,
    };
  };

  // Toggle expand/collapse of a day
  const toggleDay = (dayId) => {
    setDayDetails((d) => ({ ...d, [dayId]: initDetail(dayId) }));
    setExpandedDay((cur) => (cur === dayId ? null : dayId));
    setSuggestions([]);
  };

  // Update detail object for a day
  const updateDay = (dayId, detail) =>
    setDayDetails((d) => ({ ...d, [dayId]: detail }));

  // Format time input
  const formatTime = (v) => {
    const c = v.replace(/[^0-9:]/g, "").slice(0, 5);
    return c.length === 2 && !c.includes(":") ? `${c}:` : c;
  };

  // Autocomplete suggestions for new place name
  useEffect(() => {
    const term = (dayDetails[expandedDay]?.newName || "").trim();
    if (!term) return setSuggestions([]);
    const ctrl = new AbortController();
    fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${new URLSearchParams(
        {
          input: term,
          types: "establishment",
          key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        }
      )}`,
      { signal: ctrl.signal }
    )
      .then((r) => r.json())
      .then((data) =>
        setSuggestions(data.status === "OK" ? data.predictions : [])
      )
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
    return () => ctrl.abort();
  }, [expandedDay, dayDetails]);

  // Pick an autocomplete suggestion and create the place
  const pickSuggestion = async (s) => {
    const detail = dayDetails[expandedDay];
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${new URLSearchParams(
        {
          place_id: s.place_id,
          fields: "name,geometry,photos",
          key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        }
      )}`
    );
    const { status, result } = await res.json();
    if (status !== "OK") throw new Error(status);

    const photoUrl = result.photos?.[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${
          result.photos[0].photo_reference
        }&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      : null;
    const { lat, lng } = result.geometry.location;

    const dto = {
      location: result.name,
      type: detail.newType,
      time: detail.newTime,
      latitude: lat,
      longitude: lng,
      photoUrl,
      notes: [],
    };
    const created = await createPlace(dayPlanId, dto);
    onPlaceAdded(created);

    const upd = initDetail(expandedDay);
    updateDay(expandedDay, {
      ...upd,
      places: [...upd.places, { ...created, origIdx: upd.places.length }],
      newName: "",
      newTime: "",
    });
    setSuggestions([]);
  };

  // Delete a place both locally and notify parent
  const handleDeletePlace = async (dayId, origIdx, placeId) => {
    await deletePlace(dayPlanId, placeId);

    // update local
    const detail = dayDetails[dayId];
    const filtered = detail.places.filter((p) => p.origIdx !== origIdx);
    updateDay(dayId, { ...detail, places: filtered });

    // notify parent
    if (typeof onPlaceDeleted === "function") {
      onPlaceDeleted(placeId);
    }
  };

  // Add a new note to a place
  const addNewNote = async (dayId, origIdx) => {
    const detail = dayDetails[dayId];
    const place = detail.places.find((p) => p.origIdx === origIdx);
    if (!place.newNote.trim()) return;
    await createNote(place.id, { text: place.newNote });
    const notes = await getNotesByPlace(place.id);
    const updated = detail.places.map((p) =>
      p.origIdx === origIdx ? { ...p, notes, newNote: "" } : p
    );
    updateDay(dayId, { ...detail, places: updated });
  };

  // Remove a note from a place
  const removeNote = async (dayId, origIdx, noteId) => {
    const detail = dayDetails[dayId];
    const place = detail.places.find((p) => p.origIdx === origIdx);
    await deleteNote(place.id, noteId);
    const updated = detail.places.map((p) =>
      p.origIdx === origIdx
        ? { ...p, notes: p.notes.filter((n) => n.id !== noteId) }
        : p
    );
    updateDay(dayId, { ...detail, places: updated });
  };

  return (
    <div className="day-by-day-tab">
      <div className="day-list">
        {days.map(({ id, date, location }) => {
          const detail = dayDetails[id] || initDetail(id);
          const grouped = detail.places.reduce((acc, p) => {
            (acc[p.type] ||= []).push(p);
            return acc;
          }, {});

          return (
            <div
              key={id}
              className={`day-card ${expandedDay === id ? "expanded" : ""}`}
            >
              <div className="day-header" onClick={() => toggleDay(id)}>
                <div className="day-header-info">
                  <span className="day-date">{date}</span>
                  <span className="day-location">{location}</span>
                </div>
                <i
                  className={`fas ${
                    expandedDay === id ? "fa-chevron-down" : "fa-chevron-right"
                  }`}
                />
              </div>

              {expandedDay === id && (
                <div className="day-details">
                  {/* Category buttons */}
                  <div className="category-row">
                    {GENERAL_PLACE_TYPES.map(({ label, icon }) => (
                      <button
                        key={label}
                        className={`category-btn ${
                          detail.newType === label ? "active" : ""
                        }`}
                        onClick={() =>
                          updateDay(id, { ...detail, newType: label })
                        }
                      >
                        <i className={`fas ${icon}`} /> {label}
                      </button>
                    ))}
                  </div>

                  {/* Add place input */}
                  <div className="place-input-wrapper">
                    <input
                      className="place-input"
                      placeholder={`Add a ${detail.newType}`}
                      value={detail.newName}
                      onChange={(e) =>
                        updateDay(id, { ...detail, newName: e.target.value })
                      }
                    />
                    <input
                      className="time-input"
                      placeholder="HH:MM"
                      value={detail.newTime}
                      onChange={(e) =>
                        updateDay(id, {
                          ...detail,
                          newTime: formatTime(e.target.value),
                        })
                      }
                    />
                    {suggestions.length > 0 && (
                      <ul className="suggestions-list">
                        {suggestions.map((s) => (
                          <li
                            key={s.place_id}
                            onClick={() => pickSuggestion(s)}
                          >
                            {s.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Render grouped places */}
                  {Object.entries(grouped).map(([type, places]) => (
                    <div key={type} className="place-group">
                      <h4 className="group-title">
                        <i
                          className={`fas ${
                            GENERAL_PLACE_TYPES.find((c) => c.label === type)
                              ?.icon
                          }`}
                        />{" "}
                        {type}
                      </h4>
                      {places.map((pl) => (
                        <div key={pl.id} className="place-card added">
                          <div className="place-header">
                            <span className="badge">
                              <i
                                className={`fas ${
                                  GENERAL_PLACE_TYPES.find(
                                    (c) => c.label === pl.type
                                  )?.icon
                                }`}
                              />{" "}
                              {pl.type}
                            </span>
                            <span className="place-name">{pl.location}</span>
                            {pl.time && (
                              <span className="place-time">🕒 {pl.time}</span>
                            )}
                            <i
                              className="fas fa-trash-alt place-remove"
                              onClick={() =>
                                handleDeletePlace(id, pl.origIdx, pl.id)
                              }
                            />
                          </div>

                          {/* Notes section */}
                          <div className="note-section">
                            <ul className="note-list">
                              {pl.notes.map((n) => (
                                <li key={n.id} className="note-chip">
                                  {n.text}
                                  <i
                                    className="fas fa-times-circle"
                                    onClick={() =>
                                      removeNote(id, pl.origIdx, n.id)
                                    }
                                    style={{ marginLeft: 8, cursor: "pointer" }}
                                  />
                                </li>
                              ))}
                            </ul>
                            <div className="note-input-wrapper">
                              <input
                                className="note-input"
                                placeholder="Add note…"
                                value={pl.newNote}
                                onChange={(e) => {
                                  const det0 = dayDetails[id];
                                  const places = det0.places.map((x) =>
                                    x.origIdx === pl.origIdx
                                      ? { ...x, newNote: e.target.value }
                                      : x
                                  );
                                  updateDay(id, { ...det0, places });
                                }}
                              />
                              <button
                                className="add-btn"
                                onClick={() => addNewNote(id, pl.origIdx)}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
