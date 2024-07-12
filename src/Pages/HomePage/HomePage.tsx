import "./index.css"
import UserProfile from "../../Components/UserProfile/UserProfile";
import GroupList from "../../Components/GroupList/GroupList";
import GroupTitle from "../../Components/GroupTitle/GroupTitle";
import SettingsButton from "../../Components/SettingsButton/SettingsButton";
import QuizHeader from "../../Components/QuizHeader/QuizHeader";

function HomePage() {
    return (
        <div className="main">
            <div className="left-main">
                <UserProfile />
                <GroupList />
                {/* <div className="personal"></div> */}
            </div>
            <div className="right-main">
                <div className="groupInfo">
                    <div className="groupHeader">
                        <GroupTitle />
                        <SettingsButton />
                    </div>
                    <hr></hr>
                    <div className="leaderInfo">
                        <div className="bar" id="bar2"/>
                        <div className="bar" id="bar1"/>
                        <div className="bar" id="bar3"/>
                    </div>
                    <div className="quizInfo">
                        <QuizHeader />
                    </div>
                    <div className="quizMenu">quiz</div>
                </div>
            </div>
        </div>
    );
}


export default HomePage;