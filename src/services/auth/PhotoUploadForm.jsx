// src/features/auth/PhotoUploadModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import { uploadPhotoApi as uploadPhoto } from "./authService";
import "./PhotoUploadForm.css";

export default function PhotoUploadForm({ isOpen, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // create a preview URL when file changes
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e) => {
    setError("");
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setSaving(true);
    try {
      const url = await uploadPhoto(file);
      onUploaded(url);
      onClose();
    } catch (e) {
      // Handle specific error messages from API
      const errorMessage =
        e.response?.data?.title ||
        e.response?.data?.message ||
        "Upload failed. Please try again.";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="photo-modal">
        <h2>Change Profile Photo</h2>
        <div className="preview">
          {preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <div className="placeholder">No image selected</div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {error && <div className="error">{error}</div>}
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}
