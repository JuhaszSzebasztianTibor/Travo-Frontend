import { useState, useEffect } from "react";
import { parseISO, differenceInCalendarDays, format } from "date-fns";
import { getTripById } from "../../../../../services/trips/tripService";
import { getTripBudgets } from "../../../../../services/budget/budgetService";
import {
  getTripDayPlans,
  createDayPlan,
} from "../../../../../services/planner/dayplan/dayPlanService";
import {
  getPlacesByDayPlan,
  getPlacesByTrip,
} from "../../../../../services/planner/places/placeService";

export function usePlanner(tripId, destinations) {
  const [activeTab, setActiveTab] = useState("destinations");
  const [selectedDestination, setSelectedDestination] = useState({
    id: null,
    name: null,
    nights: 0,
  });

  const [tripInfo, setTripInfo] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [dayPlanIds, setDayPlanIds] = useState({});
  const [userPlaces, setUserPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);

  // Load trip info and budgets
  useEffect(() => {
    if (!tripId) return;
    let isMounted = true;
    (async () => {
      try {
        const trip = await getTripById(tripId);
        const tripBudgets = await getTripBudgets(tripId);
        if (isMounted) {
          setTripInfo(trip);
          setBudgets(tripBudgets);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [tripId]);

  // Ensure every destination has a day-plan
  useEffect(() => {
    if (!tripInfo || !destinations?.length) return;
    let isMounted = true;
    (async () => {
      try {
        // Safely load existing day plans, fallback to empty if error
        let existing = [];
        try {
          existing = await getTripDayPlans(tripId);
        } catch (e) {
          console.error(
            "Failed to fetch existing day plans, proceeding to create new ones.",
            e
          );
        }

        const map = existing.reduce(
          (acc, dp) => ({ ...acc, [dp.destinationId]: dp.id }),
          {}
        );

        for (const d of destinations) {
          if (!map[d.id]) {
            const dto = {
              date: format(parseISO(tripInfo.startDate), "yyyy-MM-dd"),
              location: d.name,
              tripId,
              destinationId: d.id,
              places: [],
            };
            const created = await createDayPlan(tripId, dto);
            map[d.id] = created.id;
          }
        }

        if (isMounted) setDayPlanIds(map);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [tripInfo, tripId, destinations]);

  const currentDayPlanId = selectedDestination.id
    ? dayPlanIds[selectedDestination.id]
    : null;

  // Load places when switching to "Day by day" for a specific destination
  useEffect(() => {
    if (activeTab !== "day-by-day" || !tripId) return;
    if (!selectedDestination.id) return;
    if (!dayPlanIds[selectedDestination.id]) return;

    const loadPlaces = async () => {
      try {
        const data = await getPlacesByDayPlan(currentDayPlanId);
        setUserPlaces(data);
      } catch (e) {
        console.error(e);
      }
    };

    loadPlaces();
  }, [
    activeTab,
    tripId,
    selectedDestination.id,
    dayPlanIds[selectedDestination.id],
  ]);

  // Load all places when back on Destinations tab
  useEffect(() => {
    if (activeTab !== "destinations") return;
    getPlacesByTrip(tripId).then(setAllPlaces).catch(console.error);
  }, [activeTab, tripId]);

  const startDate = tripInfo && parseISO(tripInfo.startDate);
  const endDate = tripInfo && parseISO(tripInfo.endDate);
  const tripLength =
    startDate && endDate ? differenceInCalendarDays(endDate, startDate) + 1 : 0;

  const totalNights = destinations?.reduce((sum, d) => sum + d.nights, 0) || 0;

  function selectDestination(id, name, nights) {
    setSelectedDestination({ id, name, nights });
    setActiveTab("day-by-day");
  }

  function resetSelection() {
    setSelectedDestination({ id: null, name: null, nights: 0 });
    setActiveTab("destinations");
  }

  return {
    activeTab,
    selectedDestination,
    setActiveTab,
    selectDestination,
    resetSelection,
    tripInfo,
    budgets,
    dayPlanIds,
    userPlaces,
    setUserPlaces,
    allPlaces,
    tripLength,
    totalNights,
    currentDayPlanId,
  };
}
