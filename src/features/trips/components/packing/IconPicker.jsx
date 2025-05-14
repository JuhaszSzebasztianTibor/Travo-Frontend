import React from "react";
import { iconLibrary } from "./utils/iconLibrary";
import "./iconPicker.css";

export default function IconPicker({ selected, onSelect }) {
  return (
    <div className="icon-picker-grid">
      {iconLibrary.map(({ className }, idx) => (
        <button
          key={idx}
          className={`icon-btn ${selected === className ? "selected" : ""}`}
          onClick={() => onSelect(className)}
        >
          <i className={`${className} fa-lg`} />
        </button>
      ))}
    </div>
  );
}
