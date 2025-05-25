import React from "react";
import Modal from "../../../../components/Modal/Modal";
import "./BudgetFormModal.css";

const DeleteBudgetForm = ({
  showModal,
  setShowModal,
  itemName,
  item,
  onConfirm,
}) => {
  if (!showModal) return null;

  return (
    <Modal isOpen onClose={() => setShowModal({ show: false, item: null })}>
      <div className="delete-budget-modal">
        <h2>
          Are you sure you want to delete <strong>{itemName}</strong>?
        </h2>
        <p>This action cannot be undone.</p>
        <div className="delete-modal-action">
          <button
            className="confirm-btn"
            onClick={() => {
              onConfirm(item.id);
              setShowModal({ show: false, item: null });
            }}
          >
            Yes
          </button>
          <button
            className="cancel-btn"
            onClick={() => setShowModal({ show: false, item: null })}
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteBudgetForm;
