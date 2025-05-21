import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { parseISO, differenceInCalendarDays, addDays, format } from "date-fns";

import { getTripById } from "../../../../services/trips/tripService";
import { getTripBudgets } from "../../../../services/budget/budgetService";
import { currencySymbolsData } from "../../../../data/currencySymbolsData";

import { useDestinations } from "./hooks/useDestinations";
import PlannerHeader from "./PlannerHeader";
import DestinationList from "./DestinationList";
import DayByDayPlanner from "./DayByDayPlanner";
import MapView from "./MapView";

import "react-circular-progressbar/dist/styles.css";
import "./planner.css";

const Planner = () => {
  const { tripId } = useParams();
  const location = useLocation();

  const [tripInfo, setTripInfo] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [activeTab, setActiveTab] = useState("destinations");
  const [currency, setCurrency] = useState("EUR");
  const [selectedDestination, setSelectedDestination] = useState(null);

  const {
    destinations,
    newDestination,
    suggestions,
    handleInputChange,
    handleAddDestination,
    handleDeleteDestination,
    handleNightsChange,
  } = useDestinations(tripId);

  useEffect(() => {
    (async () => {
      try {
        const t = await getTripById(tripId);
        setTripInfo(t);
        const b = await getTripBudgets(tripId);
        setBudgets(b);
      } catch (err) {
        console.error("Failed to load trip data:", err);
      }
    })();
  }, [tripId]);

  if (!tripInfo) return <div>Loading…</div>;

  const start = parseISO(tripInfo.startDate);
  const end = parseISO(tripInfo.endDate);
  const goal = differenceInCalendarDays(end, start) + 1;

  const totalNights = destinations.reduce((sum, d) => sum + d.nights, 0);
  const progress = Math.min(100, Math.round((totalNights / goal) * 100));
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

  let plannerStart = tripInfo.startDate;
  if (selectedDestination) {
    const idx = destinations.findIndex((d) => d.name === selectedDestination);
    const daysBefore = destinations
      .slice(0, idx)
      .reduce((a, d) => a + d.nights, 0);
    plannerStart = format(addDays(start, daysBefore), "yyyy-MM-dd");
  }

  const filtered = selectedDestination
    ? destinations.filter((d) => d.name === selectedDestination)
    : destinations;

  // derive the number of nights for the currently‐selected destination
  const selectedDestinationNights = selectedDestination
    ? destinations.find((d) => d.name === selectedDestination)?.nights || 0
    : null;

  const handleActivityClick = (name) => {
    setSelectedDestination(name);
    setActiveTab("day-by-day");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "destinations") setSelectedDestination(null);
  };

  return (
    <div className="planner-container">
      <aside className="left-panel">
        <PlannerHeader
          tripName={tripInfo.tripName}
          startDate={tripInfo.startDate}
          endDate={tripInfo.endDate}
          nightsPlanned={totalNights}
          progress={progress}
          goal={goal}
          currency={currency}
          currencySymbols={currencySymbolsData}
          amount={totalBudget}
          handleCurrencyChange={setCurrency}
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
          <>
            <DestinationList
              destinations={destinations}
              tripStartDate={tripInfo.startDate}
              onNightsChange={handleNightsChange}
              onActivityClick={handleActivityClick}
              onDeleteDestination={handleDeleteDestination}
              totalNightsPlanned={totalNights}
              goal={goal}
            />

            <div className="add-destination-btn">
              <input
                type="text"
                value={newDestination}
                onChange={handleInputChange}
                placeholder="Add new destination…"
              />
              <button onClick={handleAddDestination}>➤</button>
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((s) => (
                    <li key={s.id} onClick={() => handleAddDestination(s)}>
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <DayByDayPlanner destinations={filtered} startDate={plannerStart} />
        )}
      </aside>

      <main className="map-container">
        <MapView destinations={destinations} startDate={tripInfo.startDate} />
      </main>
    </div>
  );
};

export default Planner;
