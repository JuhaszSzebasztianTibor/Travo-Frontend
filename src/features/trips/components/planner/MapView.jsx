import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { format, addDays } from "date-fns";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = ({ destinations, startDate }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]); // Store marker references

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
      const start = format(dateCursor, "MMM d, yyyy");
      const end = format(addDays(dateCursor, dest.nights - 1), "MMM d, yyyy");

      const popupContent = `
      <div>
        <h3>${dest.name} (${dest.nights} ${
        dest.nights === 1 ? "night" : "nights"
      })</h3>
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
      markerDiv.textContent = index + 1; // Number the markers 1, 2, 3, ...

      // Set popup without close button
      const markerPopup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(markerDiv)
        .setLngLat([dest.lng, dest.lat])
        .setPopup(markerPopup)
        .addTo(map.current);

      markersRef.current.push(marker);

      // Open the popup when hovering over the marker
      markerDiv.addEventListener("mouseenter", () => {
        marker.getPopup().addTo(map.current); // Show the popup
      });

      // Close the popup when mouse leaves the marker
      markerDiv.addEventListener("mouseleave", () => {
        marker.getPopup().remove(); // Hide the popup
      });

      // Advance dateCursor
      dateCursor = addDays(dateCursor, dest.nights);
    });

    // Fit to bounds with max zoom
    if (destinations.length) {
      const bounds = new mapboxgl.LngLatBounds();
      destinations.forEach((d) => bounds.extend([d.lng, d.lat]));
      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 8, // Prevents zooming in too much
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
