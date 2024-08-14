import "./index.css";
import * as groupClient from "../../Clients/groupClient";
import * as userClient from "../../Clients/userClient"
import * as noteClient from "../../Clients/noteClient"
import { Group } from "../../Clients/groupClient";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import CreateGroupModal from "./NewGroupModalProps";

// Component to represent the list of groups the user is in
function GroupList() {
    const [groups, setGroups] = useState<Group[]>([]);
    // State to represent if the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Default profile picture
    const defaultGroupProfilePicUrl = "../Images/group.jpg";

    // Creating a new group
    const createGroup = async (groupName: string): Promise<Group> => {
        try {
            // Fetch session user to establish as the group's admin
            const user = await userClient.profile();
            const newGroup = {
                _id: "",
                name: groupName,
                userRoles: {
                    [user._id]: 'admin'
                },
                userScores: {
                    [user._id]: 0
                },
                userProgress: {
                    [user._id]: 0
                },
            };
            const createdGroup = await groupClient.createGroup(newGroup);
            console.log("Group created:", createdGroup);

            // Update user's group IDs array
            const updatedUser = await userClient.updateUser({
                ...user,
                groups: [...user.groups, createdGroup._id]
            });
            console.log("Appended to user's groups:", updatedUser);
            return createdGroup;
        } catch (error) {
            console.error("Error creating group:", error);
            throw error;
        }
    }

    // Joining a group
    const joinGroup = async (inviteCode: string): Promise<Group> => {
        try {
            // Fetch session user to establish as the group's admin
            const user = await userClient.profile();
            const joinedGroup = await groupClient.findGroupByInviteCode(inviteCode);
            console.log("Group found:", joinedGroup);

            // Update group's users
            const updatedGroup = await groupClient.updateGroup({
                ...joinedGroup,
                userRoles: {
                    ...joinedGroup.userRoles,
                    [user._id]: 'user'
                },
                userScores: {
                    ...joinedGroup.userScores,
                    [user._id]: 0
                },
                userProgress: {
                    ...joinedGroup.userProgress,
                    [user._id]: 0

                }
            });
            console.log("Group's users are updated:", updatedGroup);

            // Update user's group ID array
            const updatedUser = await userClient.updateUser({
                ...user,
                groups: [...user.groups, joinedGroup._id]
            });
            console.log("Appended to user's groups:", updatedUser);
            return joinedGroup;
        } catch (error) {
            console.error("Error creating group:", error);
            throw error;
        }
    }
    // Fetch groups available to user
    const fetchGroups = useCallback(async () => {
        try {
            const user = await userClient.profile();

            // Map through user's group IDs and fetch each group
            if (user.groups && user.groups.length > 0) {
                const fetchedGroups = await Promise.all(
                    user.groups.map((groupId: any) => groupClient.findGroupById(groupId))
                );
                console.log("Groups found:", fetchedGroups);
                setGroups(fetchedGroups);
                // If user has no groups, set groups to an empty array
            } else {
                setGroups([]);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // If user is creating a new group, open the modal
    const handleCreateGroup = () => { setIsModalOpen(true); }
    
    // Close the modal
    const handleCloseModal = () => { setIsModalOpen(false); }

    // Submitting form data for group
    const handleSubmit = async (groupName: string, file: File | null) => {
        try {
            const newGroup = await createGroup(groupName);
            if (file) {
                const newNote = await groupClient.uploadNote(newGroup._id, file);

                // Generate questions when uploading a lecture
                const questions = await noteClient.generateQuestions(newNote._id);
                console.log("Generated questions:", questions);

                // Refresh the group data to get the updated note information
                const updatedGroup = await groupClient.findGroupById(newGroup._id);
                setGroups(prevGroups => [...prevGroups, updatedGroup]);
            } else {
                setGroups(prevGroups => [...prevGroups, newGroup]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    // Submitting invite code for group
    const handleJoin = async (inviteCode: string) => {
        try {
            const joinedGroup = await joinGroup(inviteCode);
            setGroups(prevGroups => [...prevGroups, joinedGroup]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error joining group:", error);
        }
    }

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