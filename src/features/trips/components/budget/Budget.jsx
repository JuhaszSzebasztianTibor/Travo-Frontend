import React, { useState } from "react";
import PaidExpenses from "./PaidExpenses";
import PendingExpenses from "./PendingExpenses";
import SummaryPanel from "./SummaryPanel";
import AddExpenseForm from "./AddExpenseForm";
import { getCategoryIcon, categories } from "./utils/categoryUtils";
import "./budget.css";

const Budget = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const handleSaveExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  return (
    <div className="budget-container">
      <PaidExpenses
        expenses={expenses}
        onAddClick={() => setModalOpen(true)}
        getCategoryIcon={getCategoryIcon}
      />
      <PendingExpenses expenses={expenses} getCategoryIcon={getCategoryIcon} />
      <SummaryPanel
        expenses={expenses}
        categories={categories}
        getCategoryIcon={getCategoryIcon}
      />

      <AddExpenseForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveExpense}
      />
    </div>
  );
};

export default Budget;
