import "./index.css";
import * as userClient from "../../Clients/userClient";
import { FaPen } from "react-icons/fa";
import { useEffect, useState } from "react";
import UploadProfilePictureModal from "./UploadProfilePictureModalProps";

interface UserProfileProps {
    sessionProfile?: userClient.User;
    updateProfilePicture: (file: File) => Promise<void>;
}
// Component to represent the session user's profile on home page
function UserProfile({ sessionProfile, updateProfilePicture }: UserProfileProps) {
    // State to represent if user is hovering over the profile picture
    const [isHovering, setIsHovering] = useState(false);
    // State to represent if the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Default profile picture if user does not upload one
    const defaultProfilePicUrl = "../Images/default.png";
    // Profile picture URL of the user
    const profilePicUrl = sessionProfile?.profilePicture
        ? `${process.env.REACT_APP_BACKEND_URL}/${sessionProfile.profilePicture}`.replace(/\\/g, "/")
        : defaultProfilePicUrl;

    // If user is editing their profile picture, open the modal
    const handleEditProfilePicture = () => { setIsModalOpen(true); }

    // Close the modal
    const handleCloseModal = () => { setIsModalOpen(false); }

    // Uploading a profile picture
    const handleUploadProfilePicture = async (file: File) => {
        await updateProfilePicture(file);
        setIsModalOpen(false);
    };

    useEffect(() => {
        console.log("UserProfile received updated sessionProfile:", sessionProfile);
    }, [sessionProfile]);

    return (
        <div className="user-profile-container">
            <div
                className="profile-image-container"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="profile-image"
                />
                {isHovering && (
                    <div className="profile-image-overlay" onClick={handleEditProfilePicture}>
                        <FaPen />
                    </div>
                )}
            </div>
            <h3 className="profile-full-name">{sessionProfile?.firstName} {sessionProfile?.lastName}</h3>
            <small className="profile-username">@{sessionProfile?.username}</small>
            <UploadProfilePictureModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpload={handleUploadProfilePicture}
            />
        </div>
    );
}

export default UserProfile;