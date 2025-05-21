import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { format, addDays } from "date-fns";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = ({ destinations, startDate }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 20],
      zoom: 1.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !startDate) return;

    // Clean up old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    let dateCursor = new Date(startDate);

    destinations.forEach((dest, index) => {
      const lat = dest.lat ?? dest.latitude;
      const lng = dest.lng ?? dest.longitude;

      if (!isFinite(lat) || !isFinite(lng)) {
        console.warn(`Skipping invalid destination at index ${index}:`, dest);
        return;
      }

      const start = format(dateCursor, "MMM d, yyyy");
      const end = format(addDays(dateCursor, dest.nights - 1), "MMM d, yyyy");

      const popupContent = `
        <div>
          <h2>${dest.name}</h2>
          <h3>(${dest.nights} ${dest.nights === 1 ? "night" : "nights"})</h3>
          <p>${start} – ${end}</p>
        </div>
      `;

      const markerDiv = document.createElement("div");
      markerDiv.className = "map-marker";
      markerDiv.style.backgroundColor = "white";
      markerDiv.style.width = "30px";
      markerDiv.style.height = "30px";
      markerDiv.style.borderRadius = "50%";
      markerDiv.style.border = "1px solid";
      markerDiv.style.display = "flex";
      markerDiv.style.alignItems = "center";
      markerDiv.style.justifyContent = "center";
      markerDiv.style.color = "green";
      markerDiv.style.fontWeight = "bold";
      markerDiv.style.fontSize = "14px";
      markerDiv.textContent = index + 1;

      const markerPopup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(markerDiv)
        .setLngLat([lng, lat])
        .setPopup(markerPopup)
        .addTo(map.current);

      markersRef.current.push(marker);

      markerDiv.addEventListener("mouseenter", () => {
        marker.getPopup().addTo(map.current);
      });

      markerDiv.addEventListener("mouseleave", () => {
        marker.getPopup().remove();
      });

      dateCursor = addDays(dateCursor, dest.nights);
    });

    // Fit to bounds if valid coordinates exist
    const bounds = new mapboxgl.LngLatBounds();
    destinations.forEach((d) => {
      const lat = d.lat ?? d.latitude;
      const lng = d.lng ?? d.longitude;
      if (isFinite(lat) && isFinite(lng)) bounds.extend([lng, lat]);
    });

    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 8,
      });
    }
  }, [destinations, startDate]);

  return (
    <div
      ref={mapContainer}
      className="map-container"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default MapView;
