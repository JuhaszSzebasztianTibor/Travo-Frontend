import { useState, useMemo } from "react";
import { parseISO, addDays, format } from "date-fns";
import { GENERAL_PLACE_TYPES } from "../data/generalPlaceTypes";

export function useDayByDay(destinations = [], startDate) {
  const days = useMemo(() => {
    if (!startDate || !destinations.length) return [];
    const parsed = parseISO(startDate);
    const list = [];
    let cursor = parsed,
      idx = 1;
    destinations.forEach((d) => {
      for (let i = 0; i < d.nights; i++) {
        list.push({
          id: idx++,
          date: format(addDays(cursor, i), "EEEE, do MMMM yyyy"),
          location: d.name,
        });
      }
      cursor = addDays(cursor, d.nights);
    });
    return list;
  }, [destinations, startDate]);

  const [expandedDay, setExpandedDay] = useState(null);
  const [dayDetails, setDayDetails] = useState({});

  const getDetails = (day) => ({
    newType: GENERAL_PLACE_TYPES[0].label,
    newName: "",
    newTime: "",
    places: [],
    ...dayDetails[day],
  });

  const toggleDay = (day) => {
    setDayDetails((prev) => ({ ...prev, [day]: getDetails(day) }));
    setExpandedDay((cur) => (cur === day ? null : day));
  };

  return { days, expandedDay, dayDetails, toggleDay };
}
