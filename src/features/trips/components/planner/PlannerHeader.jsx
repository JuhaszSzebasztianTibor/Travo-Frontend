import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import CurrencySwitcher from "./CurrencySwitcher";
import { formatDate } from "../../../../utils/formDate";

const PlannerHeader = ({
  currency,
  currencySymbols,
  amount,
  handleCurrencyChange,
  nightsPlanned,
  progress,
  goal,
  tripName,
  startDate,
  endDate,
}) => {
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  return (
    <div className="planner-header">
      <div className="trip-title-wrapper">
        <h1>{tripName}</h1>
        <span>
          {formattedStart} - {formattedEnd} <i className="fas fa-pen-alt"></i>
        </span>
      </div>

      <div className="trip-stats">
        <div className="trip-budget">
          <h4>
            {currencySymbols[currency] || "€"} {amount}
          </h4>
          <CurrencySwitcher
            onCurrencyChange={handleCurrencyChange}
            currency={currency}
            currencySymbols={currencySymbols}
          />
        </div>
        <div className="total-planned success">
          <div className="circle-progressbar">
            <CircularProgressbar
              value={progress}
              text={`${nightsPlanned}/${goal}`}
              styles={buildStyles({
                textSize: "24px",
                pathColor: "#4caf50",
                textColor: "#333",
                trailColor: "#eee",
                backgroundColor: "#f0f0f0",
              })}
            />
          </div>
          <span>Nights planned</span>
        </div>
      </div>
    </div>
  );
};

export default PlannerHeader;
