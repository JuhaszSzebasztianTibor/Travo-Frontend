import React, { useState } from "react";
import { parseISO, differenceInCalendarDays, addDays, format } from "date-fns";

import { tripData as tripDataFromFile } from "../../data/tripData";
import { currencySymbolsData } from "../../../../data/currencySymbolsData";

import PlannerHeader from "./PlannerHeader";
import DestinationList from "./DestinationList";
import DayByDayPlanner from "./DayByDayPlanner";

import "react-circular-progressbar/dist/styles.css";
import "./planner.css";

const Planner = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [currency, setCurrency] = useState("EUR");
  const [selectedTripId, setSelectedTripId] = useState(1);
  const [selectedDestinationNights, setSelectedDestinationNights] = useState(0);
  const tripInfo = tripDataFromFile.find((t) => t.id === selectedTripId);

  // Manage destinations as state so we can update nights
  const [destinations, setDestinations] = useState(tripInfo.destinations);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // State for the input field
  const [newDestination, setNewDestination] = useState("");

  // Calculate the goal dynamically based on start and end date of the trip
  const startDate = parseISO(tripInfo.startDate);
  const endDate = parseISO(tripInfo.endDate);
  const goal = differenceInCalendarDays(endDate, startDate) + 1; // Add 1 to include the start date itself

  const totalNightsPlanned = destinations.reduce((sum, d) => sum + d.nights, 0);
  const progressValue = Math.min(
    100,
    Math.round((totalNightsPlanned / goal) * 100)
  );

  const handleNightsChange = (index, newNights) => {
    const updated = destinations.map((d, i) =>
      i === index ? { ...d, nights: newNights } : d
    );
    setDestinations(updated);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const handleActivityClick = (destinationName, nights) => {
    setSelectedDestination(destinationName);
    setActiveTab("day-by-day");
    setSelectedDestinationNights(nights); // Now `nights` is properly passed
  };

  const handleInputChange = (event) => {
    setNewDestination(event.target.value);
  };

  const handleAddDestination = () => {
    if (newDestination.trim() !== "") {
      const newDest = {
        name: newDestination,
        nights: 1,
      };
      setDestinations((prevDestinations) => [...prevDestinations, newDest]);
      setNewDestination(""); // Reset the input field
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "destinations") {
      setSelectedDestination(null); // Reset the selected destination when switching back to the destinations tab
    }
  };

  // Filter the days based on the selected destination
  const filteredDestinations = selectedDestination
    ? destinations.filter((d) => d.name === selectedDestination)
    : destinations;

  const tripStart = parseISO(tripInfo.startDate);
  let plannerStartDateISO = tripInfo.startDate;

  if (selectedDestination) {
    // find its index in the full list
    const idx = destinations.findIndex((d) => d.name === selectedDestination);
    // sum nights of everything before it
    const nightsBefore = destinations
      .slice(0, idx)
      .reduce((sum, d) => sum + d.nights, 0);
    // add that many days to the trip start
    const plannerStartDate = addDays(tripStart, nightsBefore);
    // re-format to an ISO-compatible string
    plannerStartDateISO = format(plannerStartDate, "yyyy-MM-dd");
  }

  return (
    <div className="planner-container">
      <div className="left-panel">
        <PlannerHeader
          currency={currency}
          currencySymbols={currencySymbolsData}
          amount={100}
          handleCurrencyChange={handleCurrencyChange}
          nightsPlanned={totalNightsPlanned}
          progress={progressValue}
          goal={goal}
          tripName={tripInfo.tripName}
          startDate={tripInfo.startDate} // pass tripStartDate here
          endDate={tripInfo.endDate}
          selectedDestination={selectedDestination}
          selectedDestinationNights={selectedDestinationNights}
        />

        <nav className="planner-tabs">
          <ul>
            <li
              className={activeTab === "destinations" ? "active" : ""}
              onClick={() => handleTabChange("destinations")}
            >
              Destinations
            </li>
            <li
              className={activeTab === "day-by-day" ? "active" : ""}
              onClick={() => handleTabChange("day-by-day")}
            >
              Day by day
            </li>
          </ul>
        </nav>

        {activeTab === "destinations" ? (
          <DestinationList
            destinations={destinations}
            tripStartDate={tripInfo.startDate}
            onNightsChange={handleNightsChange}
            onActivityClick={handleActivityClick}
            totalNightsPlanned={totalNightsPlanned}
            goal={goal}
          />
        ) : (
          <DayByDayPlanner
            destinations={filteredDestinations} // Pass filtered destinations here
            startDate={plannerStartDateISO}
          />
        )}

        {/* Conditionally render the input and button only in the "destinations" tab */}
        {activeTab === "destinations" && (
          <div className="add-destination-container">
            <input
              type="text"
              placeholder="Add new destination..."
              className="location-search-input search-input"
              value={newDestination}
              onChange={handleInputChange}
            />
            <button
              onClick={handleAddDestination}
              className="add-destination-btn"
            >
              Add Destination
            </button>
          </div>
        )}
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
