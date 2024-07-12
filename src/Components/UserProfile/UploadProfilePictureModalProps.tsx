import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import ReactDOM from 'react-dom';

interface UploadProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

const UploadProfilePictureModal: React.FC<UploadProfilePictureModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileTypes = ["JPEG", "PNG", "GIF"];

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setError(null);
    setSelectedFile(file);
    console.log('Selected file:', file);
  };

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