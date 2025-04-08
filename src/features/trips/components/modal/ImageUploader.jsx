import React from "react";

const ImageUploader = ({ imageUrl, imageFile, onUrlChange, onFileChange }) => {
  return (
    <>
      <h2 className="modal-heading">Image Upload or URL</h2>
      <input
        type="url"
        name="imageUrl"
        value={imageUrl}
        onChange={onUrlChange}
        placeholder="Enter image URL"
        className="image-url-input"
      />
      <div className={`file-upload-container ${imageFile ? "has-file" : ""}`}>
        <label className="file-upload-label">
          Choose File
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="file-upload-input"
          />
        </label>
      </div>
    </>
  );
};

export default ImageUploader;
