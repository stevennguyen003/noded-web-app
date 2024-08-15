import Leaderboard from "../Leaderboard/Leaderboard";
import UserActivity from "../UserActivity/UserActivity";
import QuestionFlashcard from "../QuestionFlashcard/QuestionFlashcard";
import * as groupClient from "../../Clients/groupClient";
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
                <UserActivity group={group} />
                <QuestionFlashcard group={group} onUpdateGroup={onUpdateGroup} />
            </div>
        </div>
    );
}
export default GroupDashboard;