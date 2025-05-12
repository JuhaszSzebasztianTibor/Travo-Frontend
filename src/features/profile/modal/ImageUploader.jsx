import React, { useRef } from "react";

const ImageUploader = ({ imageUrl, imageFile, onUrlChange, onFileChange }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0] || null;
    // Clear URL when file is selected
    onFileChange(file);
    onUrlChange({ target: { name: "imageUrl", value: "" } });
  };

  const handleUrlInput = (e) => {
    // Clear file when URL is entered
    onUrlChange(e);
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClearFile = () => {
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <h2 className="modal-heading">Image Upload or URL</h2>
      <div className="image-uploader">
        {/* URL Input */}
        <input
          type="url"
          name="imageUrl"
          value={imageUrl}
          onChange={handleUrlInput}
          placeholder={
            imageFile ? "File selected — URL disabled" : "Enter image URL"
          }
          className="image-url-input"
          required
          disabled={!!imageFile}
        />

        {/* File Upload */}
        <div className={`file-upload-container ${imageFile ? "has-file" : ""}`}>
          <label className="file-upload-label">
            {imageFile ? "File Selected" : "Choose File"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-upload-input"
              ref={fileInputRef}
            />
          </label>

          {imageFile && (
            <>
              <span className="file-name">{imageFile.name}</span>
              <button
                type="button"
                onClick={handleClearFile}
                className="clear-file-btn"
                title="Remove selected file"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageUploader;
