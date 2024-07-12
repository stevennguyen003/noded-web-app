import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import ReactDOM from 'react-dom';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (groupName: string, file: File | null) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [groupName, setGroupName] = useState("");

    if (!isOpen) return null;

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "nameInput") {
            setGroupName(value);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        onSubmit(groupName, selectedFile);
        onClose(); // Close the modal after submission
    };

    return ReactDOM.createPortal(
        <div className="create-group-modal-overlay">
            <div className="create-group-modal-content">
                <h2>Create a new group!</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nameInput" className="create-group-label">Group Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nameInput"
                            value={groupName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="materialInput" className="create-group-label">Material</label>
                        <FileUploader
                            handleChange={handleFileChange}
                            name="file"
                            id="materialInput"
                        />
                    </div>
                    <div className="pfp-modal-button-set">
                        <button type="button" onClick={onClose} className="btn btn-light">Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CreateGroupModal;