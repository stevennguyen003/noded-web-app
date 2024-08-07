import "./index.css";
import { useEffect, useCallback, useState } from "react";
import * as userClient from "../../Clients/userClient";
import * as groupClient from "../../Clients/groupClient";

interface LeaderboardProps { group?: groupClient.Group; }
// Component to represent the leaderboard for the group
function Leaderboard({ group }: LeaderboardProps) {
    // Holds all user profiles within the group
    const [users, setUsers] = useState<userClient.User[]>([]);
    // Fetch all users in the group
    const fetchUsers = useCallback(async () => {
        if (!group || !group.userRoles) return;
        const userPromises = Object.keys(group.userRoles).map(id => userClient.findUserById(id));
        try {
            const usersArray = await Promise.all(userPromises);
            console.log("Users in group:", usersArray);
            setUsers(usersArray);
        } catch (error) {
            console.error("Failed to fetch users in group:", error);
        }
    }, [group]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h1>Leaderboard</h1>
            </div>
            <div className="leaderboard-body-container">
                <h2>{group?.name}</h2>
            </div>
        </div>
    );
}
export default Leaderboard;