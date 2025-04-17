import { useState } from "react";
import { format, parseISO, addDays } from "date-fns";
import "./dayByDay.css";

const DayByDayPlanner = ({ destinations, startDate }) => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [dayDetails, setDayDetails] = useState({});

  // Validate and parse startDate if it's valid, otherwise use a fallback date
  const parsedStartDate = startDate ? parseISO(startDate) : new Date();

  const days = [];
  let currentDate = parsedStartDate;
  let dayCount = 1;

  // Create the days array based on the destinations
  destinations.forEach((dest) => {
    for (let i = 0; i < dest.nights; i++) {
      days.push({
        day: dayCount++,
        date: format(addDays(currentDate, i), "EEEE, do MMMM"),
        location: dest.name,
      });
    }
    currentDate = addDays(currentDate, dest.nights);
  });

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleInputChange = (day, field, value) => {
    setDayDetails((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  return (
    <div className="day-by-day-tab">
      <div className="day-list">
        {days.length > 0 ? (
          days.map(({ day, date, location }) => {
            const isExpanded = expandedDay === day;

            return (
              <div
                key={day}
                className={`day-card ${isExpanded ? "expanded" : ""}`}
              >
                <div className="day-header" onClick={() => toggleDay(day)}>
                  <div className="day-header-info">
                    <span className="day-date">{date}</span>
                    <span className="day-location">{location}</span>
                  </div>
                  <i
                    className={`fas ${
                      isExpanded ? "fa-chevron-down" : "fa-chevron-right"
                    }`}
                  />
                </div>

                {isExpanded && (
                  <div className="day-details">
                    <input
                      type="text"
                      placeholder="Add location details..."
                      value={dayDetails[day]?.locationDetails || ""}
                      onChange={(e) =>
                        handleInputChange(
                          day,
                          "locationDetails",
                          e.target.value
                        )
                      }
                    />
                    <textarea
                      placeholder="Add notes for the day..."
                      value={dayDetails[day]?.notes || ""}
                      onChange={(e) =>
                        handleInputChange(day, "notes", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No days available for this destination.</p>
        )}
      </div>
    </div>
  );
};

export default DayByDayPlanner;
