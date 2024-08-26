import "./index.css";
import { useEffect, useState } from "react";
import * as groupClient from "../../Clients/groupClient";
import * as userClient from "../../Clients/userClient";

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface UserActivityProps { group?: groupClient.Group; }
// Component to represent a user's activity within a group
function UserActivity({ group }: UserActivityProps) {
    // State to hold basic user information
    const [sessionProfile, setSessionProfile] = useState<userClient.User>();

    // Fetch the session user's profile
    const fetchProfile = async () => {
        try {
            const response = await userClient.profile();
            setSessionProfile(response);
        } catch (error) {
            console.error("Error fetching user's profile:", error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="user-activity-container">
            <div className="user-activity-header">
                <h3>User Activity</h3>
            </div>
            <div className="user-activity-body-container">
                {days.map((day) => (
                    <div key={day} className="day-tracker-container">
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default UserActivity;