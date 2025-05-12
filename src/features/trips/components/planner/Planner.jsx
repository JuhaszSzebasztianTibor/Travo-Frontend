import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useParams, useLocation } from "react-router-dom";
import { parseISO, differenceInCalendarDays, addDays, format } from "date-fns";

import { getTripById } from "../../../../services/trips/tripService";
import { currencySymbolsData } from "../../../../data/currencySymbolsData";

import PlannerHeader from "./PlannerHeader";
import DestinationList from "./DestinationList";
import DayByDayPlanner from "./DayByDayPlanner";
import MapView from "./MapView";

import "react-circular-progressbar/dist/styles.css";
import "./planner.css";

const Planner = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [currency, setCurrency] = useState("EUR");
  const { tripId } = useParams();
  const location = useLocation();
  const [tripInfo, setTripInfo] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedDestinationNights, setSelectedDestinationNights] = useState(0);
  const [newDestination, setNewDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch trip data
  // Update useEffect dependency array
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await getTripById(tripId);
        setTripInfo(data);
        setDestinations(data.destinations || []);
      } catch (err) {
        console.error("Failed to fetch trip data:", err);
      }
    };
    fetchTrip();
  }, [tripId, location.key]);

  // Autocomplete as user types
  const handleInputChange = async (e) => {
    const text = e.target.value;
    setNewDestination(text);

    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          text
        )}.json?autocomplete=true&limit=5&access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      setSuggestions(
        data.features.map((f) => ({
          id: f.id,
          name: f.place_name,
          center: f.center,
        }))
      );
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSuggestions([]);
    }
  };

  // Add destination fallback
  const handleAddDestination = async () => {
    if (!newDestination.trim()) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          newDestination
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      if (data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const placeName = data.features[0].place_name;
        setDestinations((prev) => [
          ...prev,
          { name: placeName, nights: 1, lat, lng },
        ]);
        setNewDestination("");
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("Couldn't find that location. Please try another.");
    }
  };

  if (!tripInfo) return <div>Loading trip data...</div>;

  // Date calculations
  const startDate = parseISO(tripInfo.startDate);
  const endDate = parseISO(tripInfo.endDate);
  const goal = differenceInCalendarDays(endDate, startDate) + 1;
  const totalNights = destinations.reduce((sum, d) => sum + d.nights, 0);
  const progress = Math.min(100, Math.round((totalNights / goal) * 100));

  const handleNightsChange = (idx, nights) =>
    setDestinations((dests) =>
      dests.map((d, i) => (i === idx ? { ...d, nights } : d))
    );

  const handleActivityClick = (name, nights) => {
    setSelectedDestination(name);
    setSelectedDestinationNights(nights);
    setActiveTab("day-by-day");
  };

  const handleCurrencyChange = (cur) => setCurrency(cur);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "destinations") setSelectedDestination(null);
  };

  // Planner start date for day-by-day
  let plannerStart = tripInfo.startDate;
  if (selectedDestination) {
    const idx = destinations.findIndex((d) => d.name === selectedDestination);
    const daysBefore = destinations
      .slice(0, idx)
      .reduce((sum, d) => sum + d.nights, 0);
    plannerStart = format(addDays(startDate, daysBefore), "yyyy-MM-dd");
  }

  const filteredDestinations = selectedDestination
    ? destinations.filter((d) => d.name === selectedDestination)
    : destinations;

  return (
    <div className="planner-container">
      <div className="left-panel">
        <PlannerHeader
          currency={currency}
          currencySymbols={currencySymbolsData}
          amount={100}
          handleCurrencyChange={handleCurrencyChange}
          nightsPlanned={totalNights}
          progress={progress}
          goal={goal}
          tripName={tripInfo.tripName}
          startDate={tripInfo.startDate}
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
          <>
            <DestinationList
              destinations={destinations}
              tripStartDate={tripInfo.startDate}
              onNightsChange={handleNightsChange}
              onActivityClick={handleActivityClick}
              totalNightsPlanned={totalNights}
              goal={goal}
            />

            <div
              className="add-destination-btn"
              style={{ position: "relative" }}
            >
              <input
                type="text"
                placeholder="Add new destination..."
                value={newDestination}
                onChange={handleInputChange}
              />
              <button onClick={handleAddDestination}>➤</button>

              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((s) => (
                    <li
                      key={s.id}
                      onClick={() => {
                        const [lng, lat] = s.center;
                        setDestinations((prev) => [
                          ...prev,
                          { name: s.name, nights: 1, lat, lng },
                        ]);
                        setNewDestination("");
                        setSuggestions([]);
                      }}
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <DayByDayPlanner
            destinations={filteredDestinations}
            startDate={plannerStart}
          />
        )}
      </div>

      <div className="map-container">
        <MapView destinations={destinations} startDate={tripInfo.startDate} />
      </div>
    </div>
  );
};

export default Planner;
