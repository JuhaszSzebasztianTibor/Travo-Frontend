import { useState } from "react";

import { destinationsData } from "../../data/destinationsData";
import { currencySymbolsData } from "../../../../data/currencySymbolsData";

import PlannerHeader from "./PlannerHeader";
import DestinationList from "./DestinationList";

import "react-circular-progressbar/dist/styles.css";
import "./planner.css";

const Planner = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [currency, setCurrency] = useState("EUR");
  const [destinations, setDestinations] = useState(destinationsData);
  const [amount, setAmount] = useState(100);

  const totalNightsPlanned = destinations.reduce(
    (total, dest) => total + (dest.nights || 0),
    0
  );

  const goal = 14; // change this if there's a different goal for nights
  const progressValue = Math.min(
    100,
    Math.round((totalNightsPlanned / goal) * 100)
  );

  const currencySymbols = currencySymbolsData;

  const handleNightsChange = (index, newNights) => {
    const updatedDestinations = destinations.map((dest, i) =>
      i === index ? { ...dest, nights: newNights } : dest
    );
    setDestinations(updatedDestinations);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return (
    <div className="planner-container">
      <div className="left-panel">
        {/* Pass currency, currencySymbols, and amount as props */}
        <PlannerHeader
          currency={currency}
          currencySymbols={currencySymbols} // Pass it here
          amount={amount}
          handleCurrencyChange={handleCurrencyChange}
          nightsPlanned={totalNightsPlanned}
          progress={progressValue}
          goal={goal}
        />
        <nav className="planner-tabs">
          <ul>
            <li
              className={activeTab === "destinations" ? "active" : ""}
              onClick={() => setActiveTab("destinations")}
            >
              Destinations
            </li>
            <li
              className={activeTab === "daybyday" ? "active" : ""}
              onClick={() => setActiveTab("daybyday")}
            >
              Day by day
            </li>
          </ul>
        </nav>
        <DestinationList
          destinations={destinations}
          onNightsChange={handleNightsChange}
          totalNightsPlanned={totalNightsPlanned}
          goal={goal}
        />
        <input
          type="text"
          placeholder="Add new destination..."
          className="location-search-input search-input"
        />
      </div>

      <div className="map-placeholder">
        <div className="placeholder-content">
          <span>Map View</span>
          <p>Map integration placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Planner;
