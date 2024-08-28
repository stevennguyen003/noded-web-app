import "./index.css";
import * as userClient from "../../Clients/userClient";
import { FaPen, FaUserAltSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UploadProfilePictureModal from "./UploadProfilePictureModalProps";

// Component to represent the session user's profile on home page
function UserProfile({ collapsed }: { collapsed: boolean }) {
    const navigate = useNavigate();
    // State to hold basic user information
    const [sessionProfile, setSessionProfile] = useState<userClient.User>();
    // State to hold user's profile picture url
    const [profilePic, setProfilePic] = useState("");
    // State to represent if user is hovering over the profile picture
    const [isHovering, setIsHovering] = useState(false);
    // State to represent if the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to hold if use is trying to sign out
    const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
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
    const handleEditProfilePicture = () => { setIsModalOpen(true); }

    // Close the modal
    const handleCloseModal = () => { setIsModalOpen(false); }

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

    // Handle state for attempting to sign out
    const handleSignOutClick = () => {
        setIsSignOutConfirmOpen(true);
    }

    // Sign out call
    const handleSignOutConfirm = async () => {
        try {
            await userClient.signout();
            // Navigate to login page after successful sign out
            navigate('/login');
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    const handleSignOutCancel = () => {
        setIsSignOutConfirmOpen(false);
    }

    if (isSignOutConfirmOpen) {
        return (
            <div className="user-profile-container">
                <div className="sign-out-confirm">
                    <h3>Do you wish to sign out?</h3>
                    <div className="sign-out-buttons">
                        <button onClick={handleSignOutConfirm} className="confirm-button">Confirm</button>
                        <button onClick={handleSignOutCancel} className="cancel-button">Go back</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`user-profile-container ${collapsed ? 'collapsed' : ''}`}>
            {!collapsed && (
                <div className="user-profile-header">
                    <FaUserAltSlash className="logout-icon" onClick={handleSignOutClick} />
                </div>)}
            <div className={`user-profile-content ${collapsed ? 'collapsed' : ''}`}>
                <div
                    className="profile-image-container"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <img
                        src={profilePic ? profilePic : defaultProfilePicUrl}
                        alt="Profile"
                        className={`profile-image ${collapsed ? 'collapsed' : ''}`}
                    />
                    {isHovering && (
                        <div className={`profile-image-overlay ${collapsed ? 'collapsed' : ''}`} onClick={handleEditProfilePicture}>
                            <FaPen />
                        </div>
                    )}
                </div>
                <h3 className="profile-full-name">{sessionProfile?.firstName} {sessionProfile?.lastName}</h3>
                <small className="profile-username">@{sessionProfile?.username}</small>
                {collapsed && <div className="hr"></div>}
            </div>
            <UploadProfilePictureModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpload={handleUploadProfilePicture}
            />
        </div>
    );
}

export default UserProfile;