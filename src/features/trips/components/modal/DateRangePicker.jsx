import React from "react";

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  return (
    <div className="date-range-container">
      <div className="date-input-container">
        <h2 className="modal-heading">Start date</h2>
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={onChange}
          required
        />
      </div>
      <span className="date-arrow">→</span>
      <div className="date-input-container">
        <h2 className="modal-heading">End date</h2>
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
