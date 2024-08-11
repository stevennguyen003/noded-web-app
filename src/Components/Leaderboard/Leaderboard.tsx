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

    // Get the top 3 users for the podium
    const sortedUsers = Array.from(userMap.entries());
    const firstPlace = sortedUsers[0] ? sortedUsers[0][0] : null;
    const secondPlace = sortedUsers[1] ? sortedUsers[1][0] : null;
    const thirdPlace = sortedUsers[2] ? sortedUsers[2][0] : null;


    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h1>Leaderboard</h1>
            </div>
            <div className="leaderboard-body-container">
            <div className="leaderboard-podium-container">
                    <div className="bar" id="bar2">{secondPlace ? secondPlace.username : "2nd"}</div>
                    <div className="bar" id="bar1">{firstPlace ? firstPlace.username : "1st"}</div>
                    <div className="bar" id="bar3">{thirdPlace ? thirdPlace.username : "3rd"}</div>
                </div>
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
