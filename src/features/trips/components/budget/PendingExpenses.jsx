import React from "react";
import ExpenseGroup from "./ExpenseGroup";

const groupByDate = (items) =>
  items.reduce((acc, cur) => {
    const day = cur.day.split("T")[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(cur);
    return acc;
  }, {});

/**
 * Renders all “Pending” items, grouped by date,
 * reusing the same ExpenseGroup.
 */
const PendingExpenses = ({ items, onEdit, onDelete, getIcon }) => {
  const pendingItems = items.filter((i) => i.status === "Pending");
  const grouped = groupByDate(pendingItems);

  return (
    <div className="middle-panel">
      <h2>Pending</h2>
      {Object.entries(grouped).map(([day, list]) => (
        <ExpenseGroup
          key={day}
          day={day}
          items={list}
          getIcon={getIcon}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PendingExpenses;
