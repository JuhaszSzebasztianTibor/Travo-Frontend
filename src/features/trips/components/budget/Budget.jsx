import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SummaryPanel from "./SummaryPanel";
import BudgetFormModal from "./BudgetFormModal";
import PaidExpenses from "./PaidExpenses";
import PendingExpenses from "./PendingExpenses";
import {
  getTripBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../../../../services/budget/budgetService";
import { getCategoryIcon, categories } from "./utils/categoryUtils";
import "./budget.css";

const Budget = () => {
  const { tripId } = useParams();
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState({ show: false, item: null });

  useEffect(() => {
    getTripBudgets(tripId).then(setItems).catch(console.error);
  }, [tripId]);

  const openModal = (item = null) => setModal({ show: true, item });
  const closeModal = () => setModal({ show: false, item: null });

  const handleSave = async (data) => {
    const saved = modal.item
      ? await updateBudget(tripId, modal.item.id, data)
      : await createBudget(tripId, data);

    setItems((prev) =>
      modal.item
        ? prev.map((i) => (i.id === saved.id ? saved : i))
        : [...prev, saved]
    );
    closeModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    await deleteBudget(tripId, id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="budget-container">
      {/* Existing component structure remains the same */}
      <PaidExpenses
        items={items}
        onAdd={() => openModal()}
        onEdit={openModal}
        onDelete={handleDelete}
        getIcon={getCategoryIcon}
      />

      <PendingExpenses
        items={items}
        onAdd={openModal}
        onEdit={openModal}
        onDelete={handleDelete}
        getIcon={getCategoryIcon}
      />

      <SummaryPanel
        items={items}
        categories={categories}
        getIcon={getCategoryIcon}
      />

      {modal.show && (
        <BudgetFormModal
          item={modal.item}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Budget;
