import ExpenseCard from "./ExpenseCard";

const ExpenseGroup = ({ date, expenses, getCategoryIcon }) => {
  return (
    <div className="expense-date-group">
      <h4>{new Date(date).toDateString()}</h4>
      {expenses.map((e, i) => (
        <ExpenseCard key={i} expenses={e} getCategoryIcon={getCategoryIcon} />
      ))}
    </div>
  );
};

export default ExpenseGroup;
