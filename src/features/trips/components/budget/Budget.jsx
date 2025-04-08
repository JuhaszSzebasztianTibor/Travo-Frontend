import React, { useState } from "react";
import AddExpenseModal from "./AddExpenseForm";
import "./budget.css";

const Budget = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const handleSaveExpense = (expense) => {
    console.log("Saved expense:", expense);
    setExpenses((prev) => [...prev, expense]);
  };

  return (
    <>
      <div className="budget-container">
        <div className="budget-menu-container">
          <h1>Budget</h1>
          <div className="currency-swithcer"></div>

          <div className="budget-btn-container">
            <button
              className="budget-add-btn"
              onClick={() => setModalOpen(true)}
            >
              <i className="fas fa-plus-circle"></i> Add Expense
            </button>
          </div>

          {/* Add status circles, categories, etc. here */}

          <AddExpenseModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveExpense}
          />
        </div>
      </div>
    </>
  );
};

export default Budget;
