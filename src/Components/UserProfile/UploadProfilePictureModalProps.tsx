import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface UploadProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

// Popup Component to allow users to upload and save profile pictures
const UploadProfilePictureModal: React.FC<UploadProfilePictureModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload Profile Picture</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleSubmit} disabled={!selectedFile}>Upload</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>,
    document.body
  );
};

export default UploadProfilePictureModal;