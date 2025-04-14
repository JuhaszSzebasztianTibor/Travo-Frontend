// src/components/Packing/AddListForm.js
import React from "react";
import Modal from "../../../../components/Modal/Modal";
import "./modalForm.css";

const AddListForm = ({
  showModal,
  setShowModal,
  newListName,
  setNewListName,
  handleAddList,
}) => {
  return (
    <div className="packing-modal">
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>Create a New List</h3>
        <div className="packing-modal-form">
          <input
            type="text"
            placeholder="Enter new list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <button
            onClick={() => {
              handleAddList();
              setShowModal(false);
            }}
          >
            Create List
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AddListForm;
