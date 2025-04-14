// src/components/Packing/EditListForm.js
import React from "react";
import Modal from "../../../../components/Modal/Modal";
import "./modalForm.css";

const EditListForm = ({
  showModal,
  setShowModal,
  editListName,
  setEditListName,
  handleRenameList,
}) => {
  return (
    <div className="packing-modal">
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>Edit List Name</h3>
        <div className="packing-modal-form">
          <input
            type="text"
            placeholder="Enter new list name"
            value={editListName}
            onChange={(e) => setEditListName(e.target.value)}
          />
          <button
            onClick={() => {
              handleRenameList();
              setShowModal(false);
            }}
          >
            Save changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EditListForm;
