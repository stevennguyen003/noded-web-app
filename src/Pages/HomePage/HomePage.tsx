import "./index.css"
import GroupList from "../../Components/GroupList/GroupList";

function HomePage() {
    return (
        <div className="main">
            <div className="left-main">
                <div className="groupList">
                    <GroupList />
                </div>
                <div className="personal">

                </div>
            </div>
            <div className="right-main">
                <div className="groupInfo">
                    <div className="groupHeader"></div>
                </div>
            </div>
        </div>
    );
}
export default HomePage;