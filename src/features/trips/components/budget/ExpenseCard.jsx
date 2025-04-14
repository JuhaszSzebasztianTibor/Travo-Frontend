const ExpenseCard = ({ expenses, getCategoryIcon }) => (
  <div className="expense-card">
    <div className="tooltip-wrapper">
      <i
        className={`fa ${getCategoryIcon(expenses.category)} expense-icon`}
      ></i>
      <span className="tooltip-text">{expenses.category}</span>
    </div>
    <div className="expense-info">
      <strong>{expenses.name}</strong>
    </div>
    <span className="expense-amount">
      €{Number(expenses.amount).toFixed(2)}
    </span>
  </div>
);

export default ExpenseCard;
