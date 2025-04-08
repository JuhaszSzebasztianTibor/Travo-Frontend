const DestinationRow = ({
  index,
  name,
  nights,
  activities,
  transport,
  startDate,
  endDate,
  onNightsChange,
}) => (
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
            onChange={(e) =>
              onNightsChange(index, parseInt(e.target.value) || 1)
            }
            min="1"
          />
          <div
            className="days-control plus"
            onClick={() => onNightsChange(index, nights + 1)}
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
      <a className="add-btn" href="#">
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

export default DestinationRow;
