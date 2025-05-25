import React from "react";

const ExpenseCard = ({ item, getIcon, onEdit, onDelete }) => (
  <div className="expense-card">
    <i className={`fa ${getIcon(item.category)} expense-icon`} />

    <div className="expense-info">
      <strong>{item.name}</strong>
      <br />
      <small>{new Date(item.day).toLocaleDateString()}</small>
    </div>

    <span className="expense-amount">€{item.amount.toFixed(2)}</span>

    <div className="action-icons">
      <i className="fa fa-edit edit" onClick={() => onEdit(item)} />
      <i className="fa fa-trash delete" onClick={() => onDelete(item)} />
    </div>
  </div>
);

export default ExpenseCard;
