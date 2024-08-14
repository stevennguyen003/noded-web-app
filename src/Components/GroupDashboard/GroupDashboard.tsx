import SettingsButton from "../SettingsButton/SettingsButton";
import QuizHeader from "../QuizHeader/QuizHeader";
import QuizBox from "../QuizBox/QuizBox";
import Leaderboard from "../Leaderboard/Leaderboard";
import UserActivity from "../UserActivity/UserActivity";
import QuestionFlashcard from "../QuestionFlashcard/QuestionFlashcard";
import * as groupClient from "../../Clients/groupClient";
import * as noteClient from "../../Clients/noteClient"
import "./index.css";

interface GroupDashboardProps {
    group?: groupClient.Group;
    onUpdateGroup: (updatedGroup: groupClient.Group) => void;
}
// Component to represent the entire group dashboard
function GroupDashboard({ group, onUpdateGroup }: GroupDashboardProps) {
    return (
        <div className="dashboard-page-container">
            <div className="left-container">
                <Leaderboard group={group} />
            </div>
            <div className="right-container">
                <UserActivity />
                <QuestionFlashcard group={group} onUpdateGroup={onUpdateGroup} />
            </div>
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