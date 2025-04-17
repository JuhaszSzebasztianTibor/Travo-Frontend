import React from "react";
import { addDays } from "date-fns";
import DestinationRow from "./DestinationRow";
import { formatDate } from "../../../../utils/formDate";

const DestinationList = ({
  destinations,
  tripStartDate,
  onNightsChange,
  onActivityClick,
  totalNightsPlanned,
  goal,
}) => {
  // Initialize cursor with the trip's start date
  let cursor = tripStartDate;

  return (
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
        {destinations.map((dest, i) => {
          // Calculate start and end dates based on number of nights
          const start = cursor;
          const end = addDays(start, dest.nights - 1);

          // Update cursor for next destination (day after this destination's end date)
          cursor = addDays(end, 1);

          return (
            <DestinationRow
              key={dest.id}
              index={i}
              name={dest.name}
              nights={dest.nights}
              activities={dest.activities}
              transport={dest.transport}
              startDate={formatDate(start)}
              endDate={formatDate(end)}
              onNightsChange={onNightsChange}
              onActivityClick={() => onActivityClick(dest.name, dest.nights)}
              totalNightsPlanned={totalNightsPlanned}
              goal={goal}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DestinationList;
