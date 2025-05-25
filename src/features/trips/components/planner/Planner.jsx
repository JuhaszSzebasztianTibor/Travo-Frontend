import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { parseISO, differenceInCalendarDays, format, addDays } from "date-fns";
import { useLoadScript } from "@react-google-maps/api";

import { getTripById } from "../../../../services/trips/tripService";
import { getTripBudgets } from "../../../../services/budget/budgetService";
import {
  getTripDayPlans,
  createDayPlan,
} from "../../../../services/planner/dayplan/dayPlanService";
// swapped out:
import { getPlacesByTrip } from "../../../../services/planner/places/placeService";

import PlannerHeader from "./PlannerHeader";
import DestinationList from "./DestinationList";
import DayByDayPlanner from "./DayByDayPlanner";
import MapView from "./MapView";
import GoogleMapView from "./GoogleMapView";

import { useDestinations } from "./hooks/useDestinations";
import { currencySymbolsData } from "../../../../data/currencySymbolsData";

import "react-circular-progressbar/dist/styles.css";
import "./planner.css";

const GOOGLE_LIBRARIES = ["places", "marker"];

export default function Planner() {
  const { tripId } = useParams();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_LIBRARIES,
    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
  });

  const [tripInfo, setTripInfo] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [dayPlanId, setDayPlanId] = useState(null);
  const [userPlaces, setUserPlaces] = useState([]);

  const {
    destinations,
    newDestination,
    suggestions,
    handleInputChange,
    handleAddDestination,
    handleDeleteDestination,
    handleNightsChange,
  } = useDestinations(tripId);

  const [activeTab, setActiveTab] = useState("destinations");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedNights, setSelectedNights] = useState(0);
  const [currency, setCurrency] = useState("EUR");

  // Load trip metadata and ensure a dayPlan exists
  useEffect(() => {
    (async () => {
      try {
        const t = await getTripById(tripId);
        setTripInfo(t);
        setBudgets(await getTripBudgets(tripId));

        const existing = await getTripDayPlans(tripId);
        let planId;
        if (existing.length) {
          planId = existing[0].id;
        } else {
          const created = await createDayPlan(tripId, {
            date: t.startDate,
            location: t.tripName,
            places: [],
          });
          planId = created.id;
        }
        setDayPlanId(planId);
      } catch (err) {
        console.error("Failed to load trip data:", err);
      }
    })();
  }, [tripId]);

  // Fetch all places for this trip whenever we switch to the day-by-day tab
  useEffect(() => {
    if (!tripId || activeTab !== "day-by-day") return;
    (async () => {
      try {
        const allPlaces = await getPlacesByTrip(tripId);
        setUserPlaces(allPlaces);
      } catch (err) {
        console.error("Failed to load existing places:", err);
      }
    })();
  }, [tripId, activeTab]);

  if (!tripInfo || dayPlanId == null) return <div>Loading…</div>;
  if (activeTab === "day-by-day" && (loadError || !isLoaded))
    return <div>{loadError ? "Error loading Maps" : "Loading Maps…"}</div>;

  const start = parseISO(tripInfo.startDate);
  const end = parseISO(tripInfo.endDate);
  const tripLength = differenceInCalendarDays(end, start) + 1;
  const totalNights = destinations.reduce((sum, d) => sum + d.nights, 0);

  const selNights = selectedNights;
  const displayNights = selectedDestination ? selNights : totalNights;
  const displayProgress = tripLength
    ? Math.min(100, Math.round((displayNights / tripLength) * 100))
    : 0;

  const days = [];

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

  const center = userPlaces.length
    ? {
        lat: userPlaces[userPlaces.length - 1].latitude,
        lng: userPlaces[userPlaces.length - 1].longitude,
      }
    : filtered.length
    ? { lat: +filtered[0].latitude, lng: +filtered[0].longitude }
    : { lat: 0, lng: 0 };

  const handleActivityClick = (name, nights) => {
    setSelectedDestination(name);
    setSelectedNights(nights);
    setActiveTab("day-by-day");
  };

  const handlePlaceAdded = (newPlace) =>
    setUserPlaces((prev) => [...prev, newPlace]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "destinations") {
      setSelectedDestination(null);
      setSelectedNights(0);
    }
  };

  return (
    <div className="planner-container">
      <aside className="left-panel">
        <PlannerHeader
          tripName={tripInfo.tripName}
          startDate={tripInfo.startDate}
          endDate={tripInfo.endDate}
          nightsPlanned={displayNights}
          progress={displayProgress}
          goal={tripLength}
          currency={currency}
          currencySymbols={currencySymbolsData}
          amount={budgets.reduce((sum, b) => sum + b.amount, 0)}
          handleCurrencyChange={setCurrency}
          selectedDestination={selectedDestination}
          selectedDestinationNights={selNights}
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
              onDeleteDestination={handleDeleteDestination}
              onActivityClick={handleActivityClick}
              totalNightsPlanned={totalNights}
              goal={tripLength}
              dayDate={days.find((d) => d.id === expandedDay)?.date}
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
          <DayByDayPlanner
            tripId={tripId}
            dayPlanId={dayPlanId}
            destinations={filtered}
            startDate={tripInfo.startDate}
            onPlaceAdded={handlePlaceAdded}
          />
        )}
      </aside>

      <main className="map-container">
        {activeTab === "destinations" ? (
          <MapView destinations={destinations} startDate={tripInfo.startDate} />
        ) : (
          <GoogleMapView
            center={center}
            userPlaces={userPlaces}
            tripInfo={tripInfo}
          />
        )}
      </main>
    </div>
  );
}
