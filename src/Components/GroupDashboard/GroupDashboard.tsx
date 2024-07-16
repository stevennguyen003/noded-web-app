import SettingsButton from "../SettingsButton/SettingsButton";
import QuizHeader from "../QuizHeader/QuizHeader";
import QuizBox from "../QuizBox/QuizBox";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import * as groupClient from "../../Clients/groupClient";
import { Group } from "../../Clients/groupClient";
import "./index.css";

// Component to represent the entire group dashboard
function GroupDashboard() {
    const navigate = useNavigate();
    // Currently viewing group's id will be contained in the URL
    const { groupId } = useParams();
    // State to hold current group
    const [group, setGroup] = useState<groupClient.Group>();
    // Fetch the group viewing
    const fetchGroup = async () => {
        try {
            // if (!groupId || groupId === 'default') {
            //     console.error("Invalid group ID:", groupId);
            //     // Handle invalid group ID (e.g., redirect to home page)
            //     return;
            // }
            const response = await groupClient.findGroupById(groupId);
            setGroup(response);
            console.log("Group found:", response);
        } catch (error) {
            console.error("Error fetching group:", error);
            // Handle error (e.g., show error message to user)
        }
    }

    useEffect(() => {
        fetchGroup();
    }, [groupId]);


    return (
        <div className="groupInfo">
            {groupId === "default" ? (
                <h1>default</h1>
            ) : groupId ? (<>
                <div className="groupHeader">
                    <div className="groupTitle">
                        {group?.name}
                    </div>
                    <SettingsButton />
                </div>
                <hr />
                <div className="leaderInfo">
                    <div className="bar" id="bar2">2nd</div>
                    <div className="bar" id="bar1">1st</div>
                    <div className="bar" id="bar3">3rd</div>
                </div>
                <div className="quizInfo">
                    <QuizHeader />
                </div>
                <div className="quizMenu">
                    <QuizBox></QuizBox>
                </div>
            </>
            ) : (
                <h1>default</h1>
            )}
        </div>
    );
}

export default GroupDashboard;