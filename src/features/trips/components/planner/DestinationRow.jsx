import React from "react";

export default function DestinationRow({
  id,
  index,
  name,
  nights,
  activities,
  transport,
  startDate,
  endDate,
  onNightsChange,
  onActivityClick,
  onDelete,
  totalNightsPlanned,
  goal,
}) {
  const canAddMore = totalNightsPlanned < goal;

  return (
    <div className="destination-row">
      {/* Number bubble */}
      <div className="counterContainer">
        <div className="counter">{index + 1}</div>
      </div>

      {/* Name & date */}
      <div className="destination-name destination-column">
        <h3>{name}</h3>
        <div className="date-range">
          <span>
            {startDate} - {endDate}
          </span>
        </div>
      </div>

      {/* Nights control */}
      <div className="destination-nights destination-column">
        <div className="destination-duration">
          <div className="duration-controls">
            <div
              className="days-control minus"
              onClick={() => onNightsChange(index, Math.max(1, nights - 1))}
            />
            <input
              type="number"
              className="days"
              value={nights}
              min="1"
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 1;
                const diff = val - nights;
                if (val >= 1 && totalNightsPlanned + diff <= goal) {
                  onNightsChange(index, val);
                }
              }}
            />
            <div
              className={`days-control plus ${!canAddMore ? "disabled" : ""}`}
              onClick={() => {
                if (canAddMore) onNightsChange(index, nights + 1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Sleep */}
      <div className="destination-sleep destination-column">
        <a
          className="add-btn"
          href=""
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <i className="fa fa-plus-circle"></i>
        </a>
      </div>

      {/* Discover (to-do's) */}
      <div className="destination-activities destination-column">
        <a
          className="add-btn"
          href=""
          onClick={(e) => {
            e.preventDefault();
            // PASS id first, then name and nights
            onActivityClick(id, name, nights);
          }}
        >
          {activities > 0 ? (
            <span className="activities-selected">
              <span>{activities}</span> to do's
            </span>
          ) : (
            <i className="fa fa-plus-circle"></i>
          )}
        </a>
      </div>

      {/* Transport */}
      <div className="destination-transport destination-column">
        <a className="add-btn" href="">
          {transport ? (
            <span className="transport-selected">{transport}</span>
          ) : (
            <i className="fa fa-plus-circle"></i>
          )}
        </a>
      </div>

      {/* Delete overlay */}
      <div className="delete-container">
        <a
          className="delete-btn"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <i className="fa fa-trash"></i>
        </a>
      </div>
    </div>
  );
}
