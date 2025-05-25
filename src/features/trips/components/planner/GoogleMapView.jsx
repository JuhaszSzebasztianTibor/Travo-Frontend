// src/components/planner/GoogleMapView.jsx
import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, InfoWindow } from "@react-google-maps/api";
import "./googlemapView.css";

const containerStyle = { width: "100%", height: "100%" };

export default function GoogleMapView({ center, userPlaces = [], tripInfo }) {
  const [map, setMap] = useState(null);
  const [selected, setSelected] = useState(null);
  const markersRef = useRef([]);

  const onLoadMap = (mapInstance) => setMap(mapInstance);

  useEffect(() => {
    if (!map) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    (async () => {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        "marker"
      );
      userPlaces.forEach((p) => {
        const content = document.createElement("div");
        Object.assign(content.style, {
          width: "32px",
          height: "32px",
          background: "#fff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        });
        const faClass =
          {
            Nature: "fa-leaf",
            "Sights & Landmarks": "fa-landmark",
            "Beaches & Lakes": "fa-umbrella-beach",
            Cultural: "fa-theater-masks",
            Entertainment: "fa-music",
            "Food & Drinks": "fa-utensils",
            Other: "fa-thumbtack",
          }[p.type] || "fa-map-marker-alt";
        const iconEl = document.createElement("i");
        iconEl.className = `fas ${faClass}`;
        Object.assign(iconEl.style, {
          fontSize: "18px",
          color: "#27ae60",
        });
        content.appendChild(iconEl);

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: p.latitude, lng: p.longitude },
          title: p.location,
          content,
        });
        marker.addListener("click", () => setSelected(p));
        markersRef.current.push(marker);
      });
    })();
  }, [map, userPlaces]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={onLoadMap}
      options={{ mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID }}
    >
      {selected && (
        <InfoWindow
          position={{ lat: selected.latitude, lng: selected.longitude }}
          options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="info-window">
            {selected.photoUrl && (
              <div className="info-photo-container">
                <img
                  src={selected.photoUrl}
                  alt={selected.location}
                  className="info-photo"
                />
              </div>
            )}
            <h4 className="info-title">{selected.location}</h4>
            {selected.notes?.length > 0 && (
              <div className="info-notes">
                <h5>Notes:</h5>
                <ul>
                  {selected.notes.map((n) => (
                    <li key={n.id}>{n.text}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="info-trip">
              <p>
                <strong>{tripInfo.dayLabel}</strong>
              </p>
              <p className="info-date">{tripInfo.dayDate}</p>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
