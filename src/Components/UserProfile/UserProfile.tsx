import "./index.css";
import * as userClient from "../../Clients/userClient";
import { FaPen } from "react-icons/fa";
import { useEffect, useState } from "react";
import UploadProfilePictureModal from "./UploadProfilePictureModalProps";

function UserProfile() {
    const [sessionProfile, setSessionProfile] = useState<userClient.User>();
    const [isHovering, setIsHovering] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const defaultProfilePicUrl = "../Images/default.png";

    const fetchProfile = async () => {
        try {
            const response = await userClient.profile();
            console.log("User profile found:", response);
            setSessionProfile(response);
        } catch (error) {
            console.error("Error fetching user's profile:", error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditProfilePicture = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleUploadProfilePicture = async (file: File) => {
        try {
            // Implement the logic to upload the profile picture
            // This is a placeholder - replace with your actual upload logic
            console.log("Uploading file:", file);
            // await userClient.uploadProfilePicture(file);
            // After successful upload, fetch the updated profile
            await fetchProfile();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    }

    return (
        <div className="user-profile-container">
            <div
                className="profile-image-container"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <img
                    src={sessionProfile?.profilePicture != "" ?
                        sessionProfile?.profilePicture : defaultProfilePicUrl}
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