import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "./budget.css"; // Import your custom styles

const SummaryPanel = ({ expenses, categories, getCategoryIcon }) => {
  const totalCost = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const paidTotal = expenses
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const pendingTotal = expenses
    .filter((e) => e.status === "Pending")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const getCategoryAmount = (cat) =>
    expenses
      .filter((e) => e.status === "Paid" && e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0);

  // Calculate progress as a percentage for the paid amount
  const paidPercentage =
    totalCost > 0
      ? paidTotal >= totalCost
        ? 100
        : Math.min((paidTotal / totalCost) * 100, 97)
      : 0;

  return (
    <div className="right-panel">
      <div className="summary-total">
        {/* Circular Progress Bar with Children */}
        <div className="circle-progressbar-container">
          <CircularProgressbarWithChildren
            value={paidPercentage}
            strokeWidth={5}
            styles={buildStyles({
              pathColor: "#4caf50", // Green for paid
              textColor: "#333",
              trailColor: "#f0f0f0",
              backgroundColor: "#f0f0f0",
              textSize: "14px",
              textAlign: "center",
            })}
          >
            {/* Overlayed Text */}
            <div className="progress-text">
              <h2>€{totalCost.toFixed(2)}</h2>
              <p>Total trip cost</p>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </div>

      <div className="summary-breakdown">
        <div className="status paid">
          <div className="status-label">
            <span className="dot"></span>
            <p>
              <strong>Paid</strong>
            </p>
          </div>
          <p className="total">€{paidTotal.toFixed(2)}</p>
        </div>
        <div className="status pending">
          <div className="status-label">
            <span className="dot"></span>
            <p>
              <strong>Pending</strong>
            </p>
          </div>
          <p className="total">€{pendingTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="category-summary">
        <h2>Paid by Category</h2>
        <div className="category-items">
          {categories.map((cat, i) => (
            <div className="category-card" key={i}>
              <i className={`fa ${getCategoryIcon(cat)}`}></i>
              {cat}: €{getCategoryAmount(cat).toFixed(2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
