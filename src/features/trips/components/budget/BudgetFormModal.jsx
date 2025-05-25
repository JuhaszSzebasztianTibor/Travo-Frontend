// src/features/trips/components/budget/BudgetFormModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../../../../components/Modal/Modal";
import "./budgetFormModal.css";

const BudgetFormModal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState({
    day: "",
    category: "",
    name: "",
    amount: "",
    status: "Pending",
  });

  // Preload when editing
  useEffect(() => {
    if (item) {
      setForm({
        day: item.day.split("T")[0] || "",
        category: item.category,
        name: item.name,
        amount: item.amount,
        status: item.status,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "status") {
      // Toggle between Pending/Paid
      setForm((prev) => ({
        ...prev,
        status: checked ? "Paid" : "Pending",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      day: new Date(form.day).toISOString(),
      category: form.category,
      name: form.name,
      amount: parseFloat(form.amount),
      status: form.status,
    };
    console.log("🏹 Submitting budget payload:", payload);
    onSave(payload);
  };

  return (
    <Modal isOpen onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        {/* Day */}
        <label>
          <h3>Day</h3>
          <input
            type="date"
            name="day"
            value={form.day}
            onChange={handleChange}
            required
          />
        </label>

        {/* Category */}
        <label>
          <h3>Category</h3>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>
              Select a category...
            </option>
            <option value="Sleep">Sleep</option>
            <option value="Transport">Transport</option>
            <option value="Visit Places">Visit Places</option>
            <option value="Eat & Drinks">Eat & Drinks</option>
            <option value="Other">Other</option>
          </select>
        </label>

        {/* Name */}
        <label>
          <h3>Name</h3>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        {/* Amount */}
        <label>
          <h3>Amount</h3>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            min="0"
            className="no-arrows"
          />
        </label>

        {/* Status Toggle */}
        <label className="switch-label">
          <h3>Status</h3>
          <div className="switch-inline">
            <span className="switch-text">{form.status}</span>
            <div className="switch-container">
              <input
                type="checkbox"
                id="statusSwitch"
                name="status"
                checked={form.status === "Paid"}
                onChange={handleChange}
                className="switch-input"
              />
              <label htmlFor="statusSwitch" className="switch-slider"></label>
            </div>
          </div>
        </label>

        {/* Actions */}
        <div className="modal-actions">
          <button type="submit" className="save-expense-btn">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetFormModal;
