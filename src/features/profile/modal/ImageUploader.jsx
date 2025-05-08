import React, { useRef } from "react";

const ImageUploader = ({ imageUrl, imageFile, onUrlChange, onFileChange }) => {
  const fileInputRef = useRef(null); // add a ref

  const handleFileSelect = (e) => {
    const file = e.target.files[0] || null;
    onFileChange({ target: { files: file ? [file] : [] } });
    if (file) {
      onUrlChange({ target: { name: "imageUrl", value: "" } });
    }
  };

  const handleUrlInput = (e) => {
    onUrlChange(e);
    if (e.target.value) {
      onFileChange({ target: { files: [] } });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset actual input value
    }
    onFileChange({ target: { files: [] } });
  };

  return (
    <>
      <h2 className="modal-heading">Image Upload or URL</h2>
      <div className="image-uploader">
        <input
          type="url"
          name="imageUrl"
          value={imageUrl}
          onChange={handleUrlInput}
          placeholder={
            imageFile ? "File selected — URL disabled" : "Enter image URL"
          }
          disabled={!!imageFile}
          className="image-url-input"
          required
        />

        <div className={`file-upload-container ${imageFile ? "has-file" : ""}`}>
          <label className="file-upload-label">
            {imageFile ? "File Selected" : "Choose File"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={!!imageUrl}
              className="file-upload-input"
              ref={fileInputRef} // use the ref here
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
