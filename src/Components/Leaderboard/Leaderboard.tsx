import "./index.css";
import { useEffect, useCallback, useState } from "react";
import * as userClient from "../../Clients/userClient";
import * as groupClient from "../../Clients/groupClient";

interface LeaderboardProps { group?: groupClient.Group; }
// Component to represent the leaderboard for the group
function Leaderboard({ group }: LeaderboardProps) {
    // Holds all user profiles within the group
    const [userMap, setUserMap] = useState<Map<userClient.User, number>>(new Map<userClient.User, number>());
    // Fetch all users in the group
    const fetchUsers = useCallback(async () => {
        if (!group || !group.userScores) return;
        const userIds = Object.keys(group.userScores);
        // Get each user object based on IDs
        const userPromises = userIds.map(id => userClient.findUserById(id));
        try {
            const usersArray = await Promise.all(userPromises);
            // Create a new map with user objects as keys and scores as values
            const userMap = new Map<userClient.User, number>();
            usersArray.forEach(user => {
                const score = group.userScores[user._id];
                userMap.set(user, score);
            });
            setUserMap(userMap);
            console.log("userMap:", userMap);
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
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Place</th>
                            <th scope="col">Name</th>
                            <th scope="col">Username</th>
                            <th scope="col">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from(userMap.entries()).map(([user, score], index) => (
                            <tr key={user._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{user.firstName}</td>
                                <td>{user.username}</td> 
                                <td>{score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Leaderboard;
