import React from "react";
import { addDays } from "date-fns";
import DestinationRow from "./DestinationRow";
import { formatDate } from "../../../../utils/formDate";

export default function DestinationList({
  destinations,
  tripStartDate,
  onNightsChange,
  onActivityClick,
  onDeleteDestination,
  totalNightsPlanned,
  goal,
}) {
  let cursor = tripStartDate;

  return (
    <div className="planner-list-wrapper">
      <div className="destinationview-table-header">
        <ul>
          <li className="destination-col-header">
            <i className="fa fa-map-marker-alt icons" />
            <span>Destination</span>
          </li>
          <li className="nights-col-header">
            <i className="fa fa-calendar-alt icons" />
            <span>Nights</span>
          </li>
          <li className="sleep-col-header">
            <i className="fa fa-bed icons" />
            <span>Sleeping</span>
          </li>
          <li className="discover-col-header">
            <i className="fa fa-search icons" />
            <span>Discover</span>
          </li>
          <li className="transport-col-header">
            <i className="fa fa-plane icons" />
            <span>Transport</span>
          </li>
        </ul>
      </div>

      <div className="planner">
        {destinations.map((dest, i) => {
          const start = cursor;
          const end = addDays(start, dest.nights - 1);
          cursor = addDays(end, 1);

          return (
            <DestinationRow
              key={dest.id}
              id={dest.id}
              index={i}
              name={dest.name}
              nights={dest.nights}
              transport={dest.transport || null}
              startDate={formatDate(start)}
              endDate={formatDate(end)}
              onNightsChange={onNightsChange}
              onActivityClick={() =>
                onActivityClick(dest.id, dest.name, dest.nights)
              }
              onDelete={() => onDeleteDestination(i)}
              totalNightsPlanned={totalNightsPlanned}
              goal={goal}
            />
          );
        })}
      </div>
    </div>
  );
}
