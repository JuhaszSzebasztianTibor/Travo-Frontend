import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { parseISO, differenceInCalendarDays, addDays, format } from "date-fns";
import { useLoadScript } from "@react-google-maps/api";
import { usePlanner } from "./hooks/usePlanner";
import { useDestinations } from "./hooks/useDestinations";
import PlannerHeader from "./PlannerHeader";
import DestinationList from "./DestinationList";
import DayByDayPlanner from "./DayByDayPlanner";
import MapView from "./MapView";
import GoogleMapView from "./GoogleMapView";
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

  // DESTINATIONS CRUD
  const {
    destinations,
    newDestination,
    suggestions,
    handleInputChange,
    handleAddDestination,
    handleDeleteDestination,
    handleNightsChange,
  } = useDestinations(tripId);

  // PLANNER LOGIC
  const {
    tripInfo,
    budgets,
    activeTab,
    selectedDestination,
    setActiveTab,
    selectDestination,
    resetSelection,
    currentDayPlanId,
    userPlaces,
    setUserPlaces,
    tripLength,
    totalNights,
  } = usePlanner(tripId, destinations);

  const start = tripInfo && parseISO(tripInfo.startDate);
  const end = tripInfo && parseISO(tripInfo.endDate);
  const totalDays = start && end ? differenceInCalendarDays(end, start) + 1 : 0;

  const displayNights = selectedDestination.id
    ? selectedDestination.nights
    : totalNights;

  const progress = totalDays
    ? Math.round((displayNights / totalDays) * 100)
    : 0;

  let plannerStart = tripInfo?.startDate || "";
  let filteredDests = destinations;

  if (selectedDestination.id) {
    const idx = destinations.findIndex((d) => d.id === selectedDestination.id);
    const daysBefore = destinations
      .slice(0, idx)
      .reduce((s, d) => s + d.nights, 0);
    plannerStart = format(addDays(start, daysBefore), "yyyy-MM-dd");
    filteredDests = [destinations[idx]];
  }

  const allPlaces = destinations.map((d) => ({
    latitude: +d.lat || d.latitude,
    longitude: +d.lng || d.longitude,
  }));

  const { center, zoom } = useMemo(() => {
    if (activeTab === "destinations" && allPlaces.length) {
      const sum = allPlaces.reduce(
        (acc, p) => ({
          lat: acc.lat + p.latitude,
          lng: acc.lng + p.longitude,
        }),
        { lat: 0, lng: 0 }
      );
      return {
        center: {
          lat: sum.lat / allPlaces.length,
          lng: sum.lng / allPlaces.length,
        },
        zoom: 4,
      };
    }

    if (activeTab === "day-by-day" && userPlaces.length) {
      const last = userPlaces[userPlaces.length - 1];
      return {
        center: { lat: last.latitude, lng: last.longitude },
        zoom: 14,
      };
    }

    if (filteredDests.length) {
      const d = filteredDests[0];
      return {
        center: {
          lat: +d.lat || d.latitude,
          lng: +d.lng || d.longitude,
        },
        zoom: 12,
      };
    }

    return {
      center: { lat: 0, lng: 0 },
      zoom: 1.5,
    };
  }, [activeTab, allPlaces, userPlaces, filteredDests]);

  if (!tripInfo) return <div>Loading…</div>;
  if (activeTab === "day-by-day" && (loadError || !isLoaded))
    return <div>{loadError ? "Error loading Maps" : "Loading Maps…"}</div>;

  return (
    <div className="planner-container">
      <aside
        className={`left-panel ${
          activeTab === "day-by-day" ? "no-scroll" : ""
        }`}
      >
        <PlannerHeader
          tripName={tripInfo.tripName}
          startDate={tripInfo.startDate}
          endDate={tripInfo.endDate}
          nightsPlanned={displayNights}
          progress={progress}
          goal={totalDays}
          currencySymbols={currencySymbolsData}
          currency={budgets[0]?.currency || "EUR"}
          amount={budgets.reduce((sum, b) => sum + b.amount, 0)}
          handleCurrencyChange={() => {}}
          selectedDestination={selectedDestination.name}
          selectedDestinationNights={selectedDestination.nights}
        />

        <nav className="planner-tabs">
          <ul>
            <li
              className={activeTab === "destinations" ? "active" : ""}
              onClick={resetSelection}
            >
              Destinations
            </li>
            <li
              className={activeTab === "day-by-day" ? "active" : ""}
              onClick={() => setActiveTab("day-by-day")}
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
              onActivityClick={selectDestination}
              totalNightsPlanned={totalNights}
              goal={totalDays}
            />
            <div className="add-destination-btn">
              <input
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
            dayPlanId={currentDayPlanId}
            destinations={filteredDests}
            startDate={plannerStart}
            onPlaceAdded={(p) => setUserPlaces((prev) => [...prev, p])}
            onPlaceDeleted={(deletedId) =>
              setUserPlaces((prev) => prev.filter((pl) => pl.id !== deletedId))
            }
          />
        )}
      </aside>

      <main className="map-container">
        {activeTab === "destinations" ? (
          <MapView destinations={destinations} startDate={tripInfo.startDate} />
        ) : (
          <GoogleMapView
            center={center}
            zoom={zoom}
            userPlaces={userPlaces}
            tripInfo={tripInfo}
          />
        )}
      </main>
    </div>
  );
}
