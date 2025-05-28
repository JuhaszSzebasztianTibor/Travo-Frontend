// src/hooks/useDestinations.jsx
import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import {
  getTripDestinations,
  createDestination,
  deleteDestination,
  patchNights,
} from "../../../../../services/planner/destinations/destinationService";

export const useDestinations = (tripId) => {
  const [destinations, setDestinations] = useState([]);
  const [newDestination, setNewDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (tripId) {
      getTripDestinations(tripId).then(setDestinations).catch(console.error);
    } else {
      setDestinations([]);
    }
  }, [tripId]);

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
      const { features } = await res.json();
      setSuggestions(
        features.map((f) => ({
          id: f.id,
          name: f.place_name,
          center: f.center,
        }))
      );
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  const handleAddDestination = async (place = null) => {
    let name;
    let lat;
    let lng;

    if (place && Array.isArray(place.center)) {
      name = place.name;
      [lng, lat] = place.center;
    } else {
      name = newDestination.trim();
      if (!name) return;
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            name
          )}.json?limit=1&access_token=${mapboxgl.accessToken}`
        );
        const data = await res.json();
        if (!data.features.length) throw new Error("Location not found");
        [lng, lat] = data.features[0].center;
        name = data.features[0].place_name;
      } catch (err) {
        console.error("Error resolving typed location:", err);
        alert("Couldn't find that location.");
        return;
      }
    }

    const temp = { name, nights: 1, lat, lng };
    setDestinations((prev) => [...prev, temp]);
    setNewDestination("");
    setSuggestions([]);

    if (!tripId) return;
    try {
      const created = await createDestination(tripId, temp);
      setDestinations((prev) =>
        prev.map((d) =>
          d === temp
            ? {
                id: created.id,
                name: created.name,
                nights: created.nights,
                lat: created.latitude,
                lng: created.longitude,
                activities: created.activities || 0,
                transport: created.transport || null,
              }
            : d
        )
      );
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  const handleDeleteDestination = async (idx) => {
    const dest = destinations[idx];
    console.log("🗑️  Deleting destination at index", idx, "with id", dest.id);
    // Optimistically remove from state:
    setDestinations((prev) => prev.filter((_, i) => i !== idx));

    if (tripId && dest.id) {
      try {
        const response = await deleteDestination(tripId, dest.id);
        console.log("🗑️  DELETE response:", response.status, response.data);
      } catch (err) {
        console.error("🗑️  Delete failed:", err);
        // Optionally, re-insert the destination on failure
      }
    }
  };

  const handleNightsChange = async (idx, nights) => {
    const dest = destinations[idx];
    setDestinations((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, nights } : d))
    );
    if (tripId && dest.id) {
      try {
        await patchNights(tripId, dest.id, nights);
      } catch (err) {
        console.error("Patch nights failed:", err);
      }
    }
  };

  return {
    destinations,
    newDestination,
    suggestions,
    handleInputChange,
    handleAddDestination,
    handleDeleteDestination,
    handleNightsChange,
    setDestinations,
  };
};
