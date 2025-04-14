// src/components/Packing/DeleteListForm.js
import React from "react";
import Modal from "../../../../components/Modal/Modal";
import "./modalForm.css";

const DeleteListForm = ({
  showModal,
  setShowModal,
  selectedList,
  handleDeleteList,
}) => {
  return (
    <div className="packing-modal">
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>Are you sure you want to delete "{selectedList}"?</h3>
        <div className="packing-modal-form">
          <p>This action cannot be undone.</p>
          <div className="modal-actions-inline">
            <button
              onClick={() => {
                handleDeleteList();
                setShowModal(false);
              }}
            >
              Delete
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteListForm;
