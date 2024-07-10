import "./index.css";
import * as userClient from "../../Clients/userClient";
import { FaPen } from "react-icons/fa";
import { useEffect, useState } from "react";
import UploadProfilePictureModal from "./UploadProfilePictureModalProps";

function UserProfile() {
    const [sessionProfile, setSessionProfile] = useState<userClient.User>();
    const [profilePic, setProfilePic] = useState("");
    const [isHovering, setIsHovering] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const defaultProfilePicUrl = "../Images/default.png";

    const fetchProfile = async () => {
        try {
            const response = await userClient.profile();
            console.log("User profile found:", response);
            setSessionProfile(response);
            console.log(response.profilePicture);
            if (response.profilePicture) {
                const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
                const url = `${baseUrl}/${response.profilePicture}`;
                setProfilePic(url);
            }
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
            console.log("Starting upload process for file:", file.name);
            if (sessionProfile?._id) {
                const result = await userClient.uploadProfilePicture(sessionProfile._id, file);
                console.log("Upload result:", result);
                // After successful upload, fetch the updated profile
                await fetchProfile();
                console.log("Updated profile after upload:", sessionProfile);
                setIsModalOpen(false);
            } else {
                console.error("User ID is not available");
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };

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
                    onError={(e) => {
                        console.error("Error loading image:", e);
                        e.currentTarget.src = defaultProfilePicUrl;
                    }}
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