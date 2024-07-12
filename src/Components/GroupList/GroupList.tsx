import "./index.css";
import * as groupClient from "../../Clients/groupClient";
import * as userClient from "../../Clients/userClient"
import { Group } from "../../Clients/groupClient";
import { useEffect, useState } from "react";
import CreateGroupModal from "./CreateGroupModalProps";

// Component to represent the list of groups the user is in
function GroupList() {
    const [groups, setGroups] = useState<Group[]>([]);
    // State to represent if the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Creating a new group
    const createGroup = async (groupName: string): Promise<Group> => {
        try {
            const user = await userClient.profile();
            const newGroup = {
                _id: "",
                name: groupName,
                users: {
                    [user.username]: 'admin'
                },
            };
            const response = await groupClient.createGroup(newGroup);
            console.log("Group created:", response);
            return response;
        } catch (error) {
            console.error("Error creating group:", error);
            throw error;
        }
    }

    const fetchGroups = async () => {
        try {
            const response = await groupClient.findAllGroups();
            console.log("Groups found:", response);
            setGroups(response);
            console.log(groups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

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
                <h3>Groups</h3>
                <button onClick={handleCreateGroup}>Create</button>
            </div>
            <div className="group-list-body-container">
                {groups.map((group) => (
                    <h3 key={group._id}>{group.name}</h3>
                ))}
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