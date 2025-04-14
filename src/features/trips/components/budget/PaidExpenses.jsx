import ExpenseGroup from "./ExpenseGroup";

const PaidExpenses = ({ expenses, onAddClick, getCategoryIcon }) => {
  const grouped = groupByDate(expenses.filter((e) => e.status === "Paid"));

  return (
    <div className="left-panel">
      <div className="budget-header">
        <h2>Paid Expenses</h2>
        <button className="budget-add-btn" onClick={onAddClick}>
          <i className="fa fa-plus-circle"></i> Add Expense
        </button>
      </div>
      {Object.entries(grouped).map(([date, exps]) => (
        <ExpenseGroup
          key={date}
          date={date}
          expenses={exps}
          getCategoryIcon={getCategoryIcon}
        />
      ))}
    </div>
  );
};

const groupByDate = (arr) =>
  arr.reduce((acc, curr) => {
    acc[curr.day] = acc[curr.day] || [];
    acc[curr.day].push(curr);
    return acc;
  }, {});

export default PaidExpenses;
