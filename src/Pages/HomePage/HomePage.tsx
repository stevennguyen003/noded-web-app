import "./index.css"
import UserProfile from "../../Components/UserProfile/UserProfile";
import GroupList from "../../Components/GroupList/GroupList";
import GroupDashboard from "../../Components/GroupDashboard/GroupDashboard";

function HomePage() {
    return (
        <div className="main">
            <div className="left-main">
                <UserProfile />
                <GroupList />
            </div>
            <div className="right-main">
                <GroupDashboard />
            </div>
        </div>
    );
}


export default HomePage;