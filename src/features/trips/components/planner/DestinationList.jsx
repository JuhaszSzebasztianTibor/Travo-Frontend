import DestinationRow from "./DestinationRow";

const DestinationList = ({
  destinations,
  onNightsChange,
  onNotesChange,
  totalNightsPlanned,
  goal,
}) => (
  <div className="planner-list-wrapper">
    <div className="destinationview-table-header">
      <ul>
        <li className="destination-col-header">
          <i className="fa fa-map-marker-alt icons"></i>
          <span>Destination</span>
        </li>
        <li className="nights-col-header">
          <i className="fa fa-calendar-alt icons"></i>
          <span>Nights</span>
        </li>
        <li className="sleep-col-header">
          <i className="fa fa-bed icons"></i>
          <span>Sleeping</span>
        </li>
        <li className="discover-col-header">
          <i className="fa fa-search icons"></i>
          <span>Discover</span>
        </li>
        <li className="transport-col-header">
          <i className="fa fa-plane icons"></i>
          <span>Transport</span>
        </li>
      </ul>
    </div>
    <div className="planner">
      {destinations.map((destination, index) => (
        <DestinationRow
          key={destination.id}
          index={index}
          {...destination}
          onNightsChange={onNightsChange}
          onNotesChange={onNotesChange}
          totalNightsPlanned={totalNightsPlanned}
          goal={goal}
        />
      ))}
    </div>
  </div>
);

export default DestinationList;
