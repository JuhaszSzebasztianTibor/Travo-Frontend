import React from "react";
import { countries } from "../../data/countries";

const CountrySelector = ({
  selectedCountry,
  onSelect,
  searchTerm,
  setSearchTerm,
  showDropdown,
  setShowDropdown,
  dropdownRef,
}) => {
  return (
    <div className="dropdown-container">
      <input
        type="text"
        placeholder={searchTerm || "Select country..."}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        required
      />

      {showDropdown && (
        <ul className="dropdown-list" ref={dropdownRef}>
          {countries
            .filter((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((c) => (
              <li
                key={c}
                onClick={() => {
                  onSelect(c);
                  setSearchTerm(c);
                  setShowDropdown(false);
                }}
              >
                {c}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySelector;
