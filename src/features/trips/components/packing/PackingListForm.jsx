// src/features/trips/components/packing/PackingListForm.jsx
import React, { useState, useEffect } from "react";
import Modal from "../../../../components/Modal/Modal";
import IconPicker from "./IconPicker";
import "./modalForm.css";

export const PackingListForm = ({
  isOpen,
  onClose,
  mode = "create",
  initialName = "",
  initialIcon = "",
  onSubmit,
}) => {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);

  // reset when the modal opens or props change
  useEffect(() => {
    setName(initialName);
    setIcon(initialIcon);
  }, [initialName, initialIcon, isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onSubmit({ name: name.trim(), icon });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="packing-modal">
      <Modal isOpen={isOpen} onClose={onClose}>
        <h3>{mode === "create" ? "Create New List" : "Edit List"}</h3>
        <div className="packing-modal-form">
          <input
            type="text"
            placeholder="List name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Icon</label>
          <div className="icon-picker-container">
            <IconPicker selected={icon} onSelect={setIcon} />
          </div>

          <button onClick={handleSubmit}>
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </Modal>
    </div>
  );
};
