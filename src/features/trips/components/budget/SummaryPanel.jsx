import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "./budget.css"; // Import your custom styles

const SummaryPanel = ({ items, categories, getIcon }) => {
  const total = items.reduce((sum, i) => sum + Number(i.amount), 0);
  const paid = items
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const paidPercentage = total ? Math.min((paid / total) * 100, 100) : 0;

  const getCategoryTotal = (cat) =>
    items
      .filter((i) => i.status === "Paid" && i.category === cat)
      .reduce((sum, i) => sum + Number(i.amount), 0)
      .toFixed(2);

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
              <h2>€{total.toFixed(2)}</h2>
              <p>Total trip cost</p>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </div>

      <div className="summary-breakdown">
        <div className="status paid">
          <div className="status-label">
            <span className="dot paid" />
            <p>
              <strong>Paid</strong> €{paid.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="status pending">
          <div className="status-label">
            <span className="dot pending" />
            <p>
              <strong>Pending</strong> €{(total - paid).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="category-summary">
        <h2>Paid by Category</h2>
        <div className="category-items">
          {categories.map((cat) => (
            <div className="category-card" key={cat}>
              <i className={`fa ${getIcon(cat)}`} />
              <span>
                {cat}: €{getCategoryTotal(cat)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
