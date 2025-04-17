import React from "react";

const DestinationRow = ({
  index,
  name,
  nights,
  activities,
  transport,
  startDate,
  endDate,
  onNightsChange,
  onActivityClick,
  totalNightsPlanned,
  goal,
}) => {
  const canAddMore = totalNightsPlanned < goal;

  return (
    <div className="destination-row">
      <div className="counterContainer">
        <div className="counter">{index + 1}</div>
      </div>
      <div className="destination-name destination-column">
        <h3>{name}</h3>
        <div className="date-range">
          <span>
            {startDate} - {endDate}
          </span>
        </div>
      </div>
      <div className="destination-nights destination-column">
        <div className="destination-duration">
          <div className="duration-controls">
            <div
              className="days-control minus"
              onClick={() => onNightsChange(index, Math.max(1, nights - 1))}
            ></div>
            <input
              type="number"
              className="days"
              value={nights}
              min="1"
              onChange={(e) => {
                const newVal = parseInt(e.target.value) || 1;
                const diff = newVal - nights;
                if (newVal >= 1 && totalNightsPlanned + diff <= goal) {
                  onNightsChange(index, newVal);
                }
              }}
            />
            <div
              className={`days-control plus ${!canAddMore ? "disabled" : ""}`}
              onClick={() => {
                if (canAddMore) onNightsChange(index, nights + 1);
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="destination-sleep destination-column">
        <a className="add-btn" href="#">
          <i className="fa fa-plus-circle"></i>
        </a>
      </div>
      <div className="destination-activities destination-column">
        <a
          className="add-btn"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onActivityClick(name, nights); // Pass both name and nights
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
      <div className="destination-transport destination-column">
        <a className="add-btn" href="#">
          {transport ? (
            <span className="transport-selected">{transport}</span>
          ) : (
            <i className="fa fa-plus-circle"></i>
          )}
        </a>
      </div>
    </div>
  );
};

export default DestinationRow;
