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
 * Renders all “Paid” items, grouped by date,
 * with Add / Edit / Delete handlers.
 */
const PaidExpenses = ({ items, onAdd, onEdit, onDelete, getIcon }) => {
  const paidItems = items.filter((i) => i.status === "Paid");
  const grouped = groupByDate(paidItems);

  return (
    <div className="left-panel">
      <div className="budget-header">
        <h2>Paid</h2>
        <button onClick={onAdd} className="budget-add-btn">
          <i className="fa fa-plus-circle" /> Add Expense
        </button>
      </div>

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

export default PaidExpenses;
