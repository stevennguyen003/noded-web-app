import "./index.css";
import { useEffect, useCallback } from "react";
import * as userClient from "../../Clients/userClient";
import * as groupClient from "../../Clients/groupClient";

interface LeaderboardProps {
    group?: groupClient.Group;
}

// Component to represent the leaderboard for the group
function Leaderboard({ group }: LeaderboardProps) {

    // // Fetch groups available to user
    // const fetchUsers = useCallback(async () => {
    //     try {
    //         const user = await userClient.profile();
    //         if (user.groups && user.groups.length > 0) {
    //             // Map through user's group IDs and fetch each group
    //             const fetchedGroups = await Promise.all(
    //                 user.groups.map((groupId: any) => groupClient.findGroupById(groupId))
    //             );
    //             console.log("Groups found:", fetchedGroups);
    //             setGroups(fetchedGroups);
    //         } else {
    //             // If user has no groups, set groups to an empty array
    //             setGroups([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching groups:", error);
    //     }
    // }, []);

    // useEffect(() => {
    //     fetchGroups();
    // }, [fetchGroups]);


    return (
        <div className="group-profile-container">
            <h2>{group?.name}</h2>
        </div>
    );
}
export default Leaderboard;