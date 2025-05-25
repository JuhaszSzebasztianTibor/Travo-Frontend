import React from "react";
import Modal from "../../../components/Modal/Modal";

const DeleteTripForm = ({ showModal, setShowModal, tripName, onConfirm }) => {
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div className="delete-trip-modal">
        <h2>
          Are you sure you want to delete <strong>{tripName}</strong> Trip?
        </h2>
        <p>This action cannot be undone.</p>
        <div className="delete-modal-action">
          <button className="confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-btn" onClick={() => setShowModal(false)}>
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTripForm;
