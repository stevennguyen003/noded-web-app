import React from 'react';
import ReactDOM from 'react-dom';

interface UploadProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadProfilePictureModal: React.FC<UploadProfilePictureModalProps> = ({ isOpen, onClose, onUpload }) => {
  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload Profile Picture</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>,
    document.body
  );
};

export default UploadProfilePictureModal;