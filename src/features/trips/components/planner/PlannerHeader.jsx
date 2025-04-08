import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import CurrencySwitcher from "./CurrencySwitcher";

const PlannerHeader = ({
  currency,
  currencySymbols,
  amount,
  handleCurrencyChange,
  nightsPlanned,
  progress,
  goal,
}) => (
  <div className="planner-header">
    <div className="trip-title-wrapper">
      <h1>London</h1>
      <span>
        28 February - 11 March <i className="fas fa-pen-alt"></i>
      </span>
    </div>
    <div className="trip-stats">
      <div className="trip-budget">
        <h4>
          {/* Display currency symbol dynamically based on selected currency */}
          {currencySymbols[currency] || "€"} {amount}
        </h4>
        {/* Currency switcher component */}
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

export default PlannerHeader;
