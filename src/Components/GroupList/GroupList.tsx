import "./index.css";
import * as groupClient from "../../Clients/groupClient";
import * as userClient from "../../Clients/userClient"
import * as noteClient from "../../Clients/noteClient"
import { Group } from "../../Clients/groupClient";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import CreateGroupModal from "./NewGroupModalProps";

interface GroupListProps {
    sessionProfile?: userClient.User;
    onProfileUpdate: (updatedProfile: userClient.User) => void;
}
// Component to represent the list of groups the user is in
function GroupList({ sessionProfile, onProfileUpdate }: GroupListProps) {
    const [groups, setGroups] = useState<Group[]>([]);
    // State to represent if the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Default profile picture
    const defaultGroupProfilePicUrl = "../Images/group.jpg";

    // Fetch groups available to user
    const fetchGroups = useCallback(async () => {
        if (!sessionProfile) return;
        try {
            const fetchedGroups = await Promise.all(
                sessionProfile.groups.map((groupId: string) => groupClient.findGroupById(groupId))
            );
            setGroups(fetchedGroups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    }, [sessionProfile]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // Creating a new group
    const createGroup = async (groupName: string, file: File | null): Promise<void> => {
        if (!sessionProfile) return;
        try {
            const createdGroup = await groupClient.createGroup(groupName, sessionProfile._id);
            const updatedUser = await userClient.updateUser({
                ...sessionProfile,
                groups: [...sessionProfile.groups, createdGroup._id]
            });
            onProfileUpdate(updatedUser);
            if (file) {
                const newNote = await groupClient.uploadNote(createdGroup._id, file);
                await noteClient.generateQuestions(newNote._id);
                const updatedGroup = await groupClient.findGroupById(createdGroup._id);
                setGroups(prevGroups => [...prevGroups, updatedGroup]);
            } else {
                setGroups(prevGroups => [...prevGroups, createdGroup]);
            }
        } catch (error) {
            console.error("Error creating group:", error);
        }
    }

    // Joining a group
    const joinGroup = async (inviteCode: string): Promise<void> => {
        if (!sessionProfile) return;
        try {
            const joinedGroup = await groupClient.findGroupByInviteCode(inviteCode);
            const updatedGroup = await groupClient.joinGroup(joinedGroup, sessionProfile._id);
            const updatedUser = await userClient.updateUser({
                ...sessionProfile,
                groups: [...sessionProfile.groups, joinedGroup._id]
            });
            onProfileUpdate(updatedUser);
            setGroups(prevGroups => [...prevGroups, updatedGroup]);
        } catch (error) {
            console.error("Error joining group:", error);
        }
    }

    // If user is creating a new group, open the modal
    const handleCreateGroup = () => { setIsModalOpen(true); }

    // Close the modal
    const handleCloseModal = () => { setIsModalOpen(false); }

    // Submitting form data for group
    const handleSubmit = async (groupName: string, file: File | null) => {
        await createGroup(groupName, file);
        setIsModalOpen(false);
    };

    // Submitting invite code for group
    const handleJoin = async (inviteCode: string) => {
        await joinGroup(inviteCode);
        setIsModalOpen(false);
    };

    return (
        <div className="group-list-container">
            <div className="group-list-header-container">
                <h3>GROUPS</h3>
                <FaPlus onClick={handleCreateGroup} style={{ cursor: 'pointer' }} />
            </div>
            <div className="group-list-body-container">
                {groups.map((group) => (
                    <div key={group._id} className="group-header-container">
                        <img
                            src={defaultGroupProfilePicUrl}
                            alt="Group Profile"
                            className="group-profile-image"
                        />
                        <Link to={`/home/${group._id}`} className="group-header-name">{group.name}</Link>
                    </div>
                ))}
            </div>
            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onJoin={handleJoin}
            />
        </div>
    );
}
export default GroupList;