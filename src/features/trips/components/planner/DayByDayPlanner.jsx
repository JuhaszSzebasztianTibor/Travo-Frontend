import { useState } from "react";
import { format, parseISO, addDays } from "date-fns";
import "./dayByDay.css";

const GENERAL_PLACE_TYPES = [
  { label: "Nature", icon: "fa-leaf" },
  { label: "Sights & Landmarks", icon: "fa-landmark" },
  { label: "Beaches & Lakes", icon: "fa-umbrella-beach" },
  { label: "Cultural", icon: "fa-theater-masks" },
  { label: "Entertainment", icon: "fa-music" },
  { label: "Food & Drinks", icon: "fa-utensils" },
  { label: "Other", icon: "fa-thumbtack" },
];

export default function DayByDayPlanner({ destinations, startDate }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [dayDetails, setDayDetails] = useState({});

  const parsedStartDate = startDate ? parseISO(startDate) : new Date();
  const days = [];
  let current = parsedStartDate;
  let idx = 1;
  destinations.forEach((dest) => {
    for (let i = 0; i < dest.nights; i++) {
      days.push({
        id: idx++,
        date: format(addDays(current, i), "EEEE, do MMMM yyyy"),
        location: dest.name,
      });
    }
    current = addDays(current, dest.nights);
  });

  const getDetails = (day) => ({
    places: [],
    newType: GENERAL_PLACE_TYPES[0].label,
    newName: "",
    newTime: "",
    ...dayDetails[day],
  });

  const toggleDay = (day) => {
    setDayDetails((prev) => ({ ...prev, [day]: getDetails(day) }));
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  const updateDay = (day, details) => {
    setDayDetails((prev) => ({ ...prev, [day]: details }));
  };

  const addPlace = (day) => {
    setDayDetails((prev) => {
      const d = getDetails(day);
      const name = d.newName.trim();
      if (!name) return prev;
      const place = {
        name,
        type: d.newType,
        time: d.newTime?.trim() || "",
        notes: [],
        newNote: "",
      };
      return {
        ...prev,
        [day]: {
          ...d,
          places: [...d.places, place],
          newName: "",
          newTime: "",
          newType: GENERAL_PLACE_TYPES[0].label,
        },
      };
    });
  };

  const removePlace = (day, pi) => {
    setDayDetails((prev) => {
      const d = getDetails(day);
      const places = d.places.filter((_, i) => i !== pi);
      return { ...prev, [day]: { ...d, places } };
    });
  };

  const addNote = (day, pi) => {
    setDayDetails((prev) => {
      const d = getDetails(day);
      const places = d.places.map((pl, i) => {
        if (i !== pi) return pl;
        const note = pl.newNote.trim();
        if (!note) return pl;
        return { ...pl, notes: [...pl.notes, note], newNote: "" };
      });
      return { ...prev, [day]: { ...d, places } };
    });
  };

  const removeNote = (day, pi, ni) => {
    setDayDetails((prev) => {
      const d = getDetails(day);
      const places = d.places.map((pl, i) => {
        if (i !== pi) return pl;
        const notes = pl.notes.filter((_, j) => j !== ni);
        return { ...pl, notes };
      });
      return { ...prev, [day]: { ...d, places } };
    });
  };

  const formatTimeInput = (value) => {
    // Allow only numbers and colon, trim length, enforce HH:MM
    const cleaned = value.replace(/[^0-9:]/g, "").slice(0, 5);
    if (cleaned.length === 2 && !cleaned.includes(":")) return cleaned + ":";
    return cleaned;
  };

  return (
    <div className="day-by-day-tab">
      <div className="day-list">
        {days.map(({ id, date, location }) => {
          const d = getDetails(id);
          return (
            <div
              key={id}
              className={`day-card ${expandedDay === id ? "expanded" : ""}`}
            >
              <div className="day-header" onClick={() => toggleDay(id)}>
                <div className="day-header-info">
                  <span className="day-date">{date}</span>
                  <span className="day-location">
                    <i className="fa fa-map-marker-alt" /> {location}
                  </span>
                </div>
                <i
                  className={`fas ${
                    expandedDay === id ? "fa-chevron-down" : "fa-chevron-right"
                  }`}
                />
              </div>
              {expandedDay === id && (
                <div className="day-details">
                  <div className="category-row">
                    {GENERAL_PLACE_TYPES.map(({ label, icon }) => (
                      <button
                        key={label}
                        className={`category-btn ${
                          d.newType === label ? "active" : ""
                        }`}
                        onClick={() => updateDay(id, { ...d, newType: label })}
                      >
                        <i className={`fas ${icon}`} /> {label}
                      </button>
                    ))}
                  </div>
                  <div className="place-input-wrapper">
                    <input
                      type="text"
                      className="place-input"
                      placeholder={`Add a ${d.newType}`}
                      value={d.newName}
                      onChange={(e) =>
                        updateDay(id, { ...d, newName: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && addPlace(id)}
                    />
                    <input
                      type="text"
                      className="time-input"
                      placeholder="HH:MM"
                      value={d.newTime || ""}
                      onChange={(e) =>
                        updateDay(id, {
                          ...d,
                          newTime: formatTimeInput(e.target.value),
                        })
                      }
                    />
                    <button className="add-btn" onClick={() => addPlace(id)}>
                      <i className="fa fa-plus" />
                    </button>
                  </div>
                  {Object.entries(
                    d.places.reduce((groups, pl) => {
                      (groups[pl.type] ||= []).push(pl);
                      return groups;
                    }, {})
                  ).map(([type, group], gi) => (
                    <div key={gi}>
                      <div className="place-group-header">
                        <i
                          className={`fas ${
                            GENERAL_PLACE_TYPES.find((c) => c.label === type)
                              ?.icon || "fa-thumbtack"
                          }`}
                        />{" "}
                        {type}
                      </div>
                      {group.map((pl, pi) => (
                        <div key={pi} className="place-card">
                          <div className="place-header">
                            <span className="place-type badge">
                              <i
                                className={`fas ${
                                  GENERAL_PLACE_TYPES.find(
                                    (c) => c.label === pl.type
                                  )?.icon || "fa-thumbtack"
                                }`}
                              />{" "}
                              {pl.type}
                            </span>
                            <span className="place-name">{pl.name}</span>
                            {pl.time && (
                              <span className="place-time">🕒 {pl.time}</span>
                            )}
                            <i
                              className="fas fa-trash-alt place-remove"
                              onClick={() => removePlace(id, pi)}
                            />
                          </div>
                          <div className="note-section">
                            <ul className="note-list">
                              {pl.notes.map((n, ni) => (
                                <li key={ni} className="note-item">
                                  <i className="fa fa-sticky-note" /> {n}
                                  <i
                                    className="fas fa-times note-remove"
                                    onClick={() => removeNote(id, pi, ni)}
                                  />
                                </li>
                              ))}
                            </ul>
                            <input
                              type="text"
                              className="note-input"
                              placeholder="Add note..."
                              value={pl.newNote || ""}
                              onChange={(e) =>
                                updateDay(id, {
                                  ...d,
                                  places: d.places.map((x, i) =>
                                    i === pi
                                      ? { ...x, newNote: e.target.value }
                                      : x
                                  ),
                                })
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && addNote(id, pi)
                              }
                            />
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
