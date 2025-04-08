import React, { useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import "./addExpenseForm.css";

const AddExpenseForm = ({ isOpen, onClose, onSave }) => {
  const [day, setDay] = useState("");
  const [category, setCategory] = useState("Sleep");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState("Pending");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = { day, category, name, amount, currency, status };
    onSave(newExpense);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <label>
          <h3>Day</h3>
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          />
        </label>

        <label>
          <h3>Category</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Sleep">Sleep</option>
            <option value="Transport">Transport</option>
            <option value="Visit Places">Visit Places</option>
            <option value="Eat & Drinks">Eat & Drinks</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          <h3>Name</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          <h3>Amount</h3>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        <label>
          <h3>Currency</h3>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>

        <label className="switch-label">
          <h3>Status</h3>
          <div className="switch-inline">
            <span className="switch-text">{status}</span>
            <div className="switch-container">
              <input
                type="checkbox"
                id="statusSwitch"
                checked={status === "Paid"}
                onChange={() =>
                  setStatus(status === "Paid" ? "Pending" : "Paid")
                }
                className="switch-input"
              />
              <label htmlFor="statusSwitch" className="switch-slider"></label>
            </div>
          </div>
        </label>

        <div className="modal-actions">
          <button type="submit" className="save-expense-btn">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseForm;
