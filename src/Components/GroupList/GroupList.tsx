import "./index.css";
import * as groupClient from "../../Clients/groupClient";
import * as userClient from "../../Clients/userClient"
import { Group } from "../../Clients/groupClient";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import CreateGroupModal from "./CreateGroupModalProps";

// Component to represent the list of groups the user is in
function GroupList() {
    const [groups, setGroups] = useState<Group[]>([]);
    // State to represent if the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    const defaultGroupProfilePicUrl = "../Images/default.png";
    // Creating a new group
    const createGroup = async (groupName: string): Promise<Group> => {
        try {
            // Fetch session user to establish as the group's admin
            const user = await userClient.profile();
            const newGroup = {
                _id: "",
                name: groupName,
                users: {
                    [user.username]: 'admin'
                },
            };
            const createdGroup = await groupClient.createGroup(newGroup);
            console.log("Group created:", createdGroup);
            // Update user's groups
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
    // Fetch groups available to user
    const fetchGroups = useCallback(async () => {
        try {
            const user = await userClient.profile();
            if (user.groups && user.groups.length > 0) {
                // Map through user's group IDs and fetch each group
                const fetchedGroups = await Promise.all(
                    user.groups.map((groupId: any) => groupClient.findGroupById(groupId))
                );
                console.log("Groups found:", fetchedGroups);
                setGroups(fetchedGroups);
            } else {
                // If user has no groups, set groups to an empty array
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
    const handleCreateGroup = () => {
        setIsModalOpen(true);
    }
    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    // Submitting form data for group
    const handleSubmit = async (groupName: string) => {
        try {
            const newGroup = await createGroup(groupName);
            setGroups(prevGroups => [...prevGroups, newGroup]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating group:", error);
        }
    }

    return (
        <div className="group-list-container">
            <div className="group-list-header-container">
                <h3>GROUPS</h3>
                <FaPlus onClick={handleCreateGroup} style={{ cursor: 'pointer' }} />
            </div>
            <div className="group-list-body-container">
                {groups.map((group) => (<>
                    <div className="group-header-container" key={group._id}>
                        <img
                            src={defaultGroupProfilePicUrl}
                            alt="Group Profile"
                            className="group-profile-image"
                        />
                        <Link to={`/home/${group._id}`} className="group-header-name">{group.name}</Link>
                    </div>
                </>
                ))}
                <h1>Test</h1>
                <h1>Test</h1>
                <h1>Test</h1>
                <h1>Test</h1>
                <h1>Test</h1>
            </div>
            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
export default GroupList;