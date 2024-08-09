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
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Leaderboard;

{/* {users.map((user) => (
                    <div key={user._id} className="group-header-container">
                        <h1>{user.firstName}</h1>
                    </div>
                ))} */}
