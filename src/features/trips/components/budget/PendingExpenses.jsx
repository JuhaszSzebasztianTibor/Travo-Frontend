import ExpenseGroup from "./ExpenseGroup";

const PendingExpenses = ({ expenses, getCategoryIcon }) => {
  const grouped = groupByDate(expenses.filter((e) => e.status === "Pending"));

  return (
    <div className="middle-panel">
      <h2>Pending Expenses</h2>
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

export default PendingExpenses;
