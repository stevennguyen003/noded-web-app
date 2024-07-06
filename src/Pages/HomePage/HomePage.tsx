import "./index.css"

function HomePage() {
    return (
        <div className="main">
            <div className="left-main">
                <div className="groupList"></div>
                <div className="personal"></div>
            </div>
            <div className="right-main">
            <div className="groupInfo">
                <div className="groupHeader">group name + group settings</div>
                <div className="leaderInfo">leaderboard</div>
                <div className="quizInfo">header</div>
                <div className="quizMenu">quiz</div>
            </div>

            </div>
        </div>
    );
}
export default HomePage;