import React from "react";
import ExpenseCard from "./ExpenseCard";

const ExpenseGroup = ({ day, items, getIcon, onEdit, onDelete }) => (
  <div className="expense-date-group">
    <h4>{new Date(day).toDateString()}</h4>
    {items.map((item) => (
      <ExpenseCard
        key={item.id}
        item={item}
        getIcon={getIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default ExpenseGroup;
