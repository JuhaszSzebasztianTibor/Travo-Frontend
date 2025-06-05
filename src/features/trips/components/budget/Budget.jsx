import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SummaryPanel from "./SummaryPanel";
import BudgetFormModal from "./BudgetFormModal";
import DeleteBudgetForm from "./DeleteBudgetForm"; // ← import it
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
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });

  useEffect(() => {
    getTripBudgets(tripId).then(setItems).catch(console.error);
  }, [tripId]);

  /* Editing or adding */
  const openModal = (item = null) => setModal({ show: true, item });
  const closeModal = () => setModal({ show: false, item: null });

  /* Deleting */
  const openDelete = (item) => setDeleteModal({ show: true, item });
  const closeDelete = () => setDeleteModal({ show: false, item: null });

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
    await deleteBudget(tripId, id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    closeDelete();
  };

  return (
    <div className="budget-container">
      <PaidExpenses
        items={items}
        onAdd={() => openModal()}
        onEdit={openModal}
        onDelete={openDelete}
        getIcon={getCategoryIcon}
      />

      <PendingExpenses
        items={items}
        onAdd={openModal}
        onEdit={openModal}
        onDelete={openDelete}
        î
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

      <DeleteBudgetForm
        showModal={deleteModal.show}
        setShowModal={setDeleteModal}
        itemName={deleteModal.item?.name}
        item={deleteModal.item}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Budget;
