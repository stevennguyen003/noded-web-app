import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import ReactDOM from 'react-dom';

// Props used for the modal
interface UploadProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

// Modal used for a user to upload a profile picture
const UploadProfilePictureModal: React.FC<UploadProfilePictureModalProps> = ({ isOpen, onClose, onUpload }) => {
  // State to hold the file uploaded
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State to hold errors
  const [error, setError] = useState<string | null>(null);
  // Represents the valid PFP types
  const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];
  if (!isOpen) return null;
  // Called to handle state changes for the selectedFile
  const handleFileChange = (file: File) => {
    setError(null);
    setSelectedFile(file);
    console.log('Selected file:', file);
  };
  // Submitting the image uploaded
  const handleSubmit = async () => {
    if (selectedFile) {
      try {
        await onUpload(selectedFile);
        onClose();
      } catch (err) {
        console.error('Upload error:', err);
        setError('An error occurred during upload. Please try again.');
      }
    }
  };

  return ReactDOM.createPortal(
    <div className="pfp-modal-overlay">
      <div className="pfp-modal-content">
        <h2 className="pfp-modal-title">Upload an image</h2>
        <FileUploader
          handleChange={handleFileChange}
          name="file"
          types={fileTypes}
        />
        {error && <p className="error-message">{error}</p>}
        <div className="pfp-modal-button-set">
          <button onClick={onClose} className="btn btn-light">Cancel</button>
          <button onClick={handleSubmit} disabled={!selectedFile} className="btn btn-primary">Upload</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UploadProfilePictureModal;