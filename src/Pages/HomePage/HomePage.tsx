import "./index.css"
import { useParams } from "react-router";
import { useState, useCallback, useEffect } from "react";
import UserProfile from "../../Components/UserProfile/UserProfile";
import GroupList from "../../Components/GroupList/GroupList";
import DefaultDashboard from "../../Components/DefaultDashboard/DefaultDashboard";
import GroupDashboard from "../../Components/GroupDashboard/GroupDashboard";
import * as groupClient from "../../Clients/groupClient";

// Represents the home page of the website
function HomePage() {
    // Currently viewing group's id will be contained in the URL
    const { groupId } = useParams<{ groupId?: string }>();
    // State to hold current group
    const [group, setGroup] = useState<groupClient.Group | undefined>(undefined);
    // State to hold if a valid group was found from the param
    const [isValidGroup, setIsValidGroup] = useState(true);
    // Determine which dashboard to render
    const DashboardToRender = groupId === 'default' || !isValidGroup ? DefaultDashboard : GroupDashboard;
    // Fetch the group viewing
    const fetchGroup = useCallback(async () => {
        if (!groupId || groupId === 'default') {
            setGroup(undefined);
            return;
        }
        try {
            const response = await groupClient.findGroupById(groupId);
            setGroup(response);
            setIsValidGroup(true);
            console.log("Group found:", response);
        } catch (error) {
            console.error("Error fetching group:", error);
            setIsValidGroup(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchGroup();
    }, [fetchGroup]);

    return (
        <div className="main">
            <div className="left-main">
                <UserProfile />
                <GroupList />
            </div>
            <div className="right-main">
                {DashboardToRender === GroupDashboard ? (
                    <GroupDashboard group={group} />
                ) : (
                    <DefaultDashboard />
                )}
            </div>
        </div>
    );
}
export default HomePage;