import SettingsButton from "../SettingsButton/SettingsButton";
import QuizHeader from "../QuizHeader/QuizHeader";
import QuizBox from "../QuizBox/QuizBox";
import DefaultDashboard from "../DefaultDashboard/DefaultDashboard";
import Leaderboard from "../Leaderboard/Leaderboard";
import { useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import * as groupClient from "../../Clients/groupClient";
import * as noteClient from "../../Clients/noteClient"
import "./index.css";

// Component to represent the entire group dashboard
function GroupDashboard() {
    // Currently viewing group's id will be contained in the URL
    const { groupId } = useParams<{ groupId?: string }>();
    // State to hold current group
    const [group, setGroup] = useState<groupClient.Group | undefined>(undefined);
    // Fetch the group viewing
    const fetchGroup = useCallback(async () => {
        if (groupId === 'default') { return; }
        try {
            const response = await groupClient.findGroupById(groupId);
            setGroup(response);
            console.log("Group found:", response);
            const notes = await groupClient.findAllNotes(groupId);
            console.log("Notes found", notes);
            const quizzes = await noteClient.findAllQuizzes(notes[0]._id);
            console.log("Quizzes found", quizzes);
        } catch (error) {
            console.error("Error fetching group:", error);
        }
    }, [groupId]);

    useEffect(() => {
        fetchGroup();
    }, [fetchGroup]);

    return (
        <div className="dashboard-page-container">
            {groupId === "default" ? (
                <DefaultDashboard />
            ) : groupId ? (
                <>
                    <div className="group-header">
                        <h1>Dashboard</h1>
                    </div>
                    <Leaderboard group={group}/>
                </>
            ) : (
                <DefaultDashboard />
            )}
        </div>
    );
}
export default GroupDashboard;



// <>
//     <div className="groupHeader">
//         <div className="groupTitle">
//             {group?.name}
//         </div>
//         <SettingsButton />
//     </div>
//     <hr />
//     <div className="leaderInfo">
//         <div className="bar" id="bar2">2nd</div>
//         <div className="bar" id="bar1">1st</div>
//         <div className="bar" id="bar3">3rd</div>
//     </div>
//     <div className="quizInfo">
//         <QuizHeader />
//     </div>
//     <div className="quizMenu">
//         <QuizBox />
//     </div>
// </>