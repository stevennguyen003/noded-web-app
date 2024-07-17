import "./index.css";
import * as userClient from "../../Clients/userClient";
import { FaPen } from "react-icons/fa";
import { useEffect, useState } from "react";
import UploadProfilePictureModal from "./UploadProfilePictureModalProps";

// Component to represent the session user's profile on home page
function UserProfile() {
    // State to hold basic user information
    const [sessionProfile, setSessionProfile] = useState<userClient.User>();
    // State to hold user's profile picture url
    const [profilePic, setProfilePic] = useState("");
    // State to represent if user is hovering over the profile picture
    const [isHovering, setIsHovering] = useState(false);
    // State to represent if the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Default profile picture if user does not upload one
    const defaultProfilePicUrl = "../Images/default.png";
    // Fetch the session user's profile
    const fetchProfile = async () => {
        try {
            const response = await userClient.profile();
            setSessionProfile(response);
            if (response.profilePicture) {
                const url = `${process.env.REACT_APP_BACKEND_URL}/${response.profilePicture}`;
                const correctedUrl = url.replace(/\\/g, "/");
                setProfilePic(correctedUrl);
            }
        } catch (error) {
            console.error("Error fetching user's profile:", error);
        }
    }
    useEffect(() => {
        fetchProfile();
    }, []);
    // If user is editing their profile picture, open the modal
    const handleEditProfilePicture = () => {
        setIsModalOpen(true);
    }
    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    // Uploading a profile picture
    const handleUploadProfilePicture = async (file: File) => {
        try {
            if (sessionProfile?._id) {
                await userClient.uploadProfilePicture(sessionProfile._id, file);
                // Fetch the updated profile immediately after upload
                await fetchProfile();
                setIsModalOpen(false);
            } else {
                console.error("User ID is not available");
            }
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
                    src={profilePic ? profilePic : defaultProfilePicUrl}
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