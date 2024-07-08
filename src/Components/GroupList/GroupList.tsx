import "./index.css";
import { FaLayerGroup } from "react-icons/fa"

function GroupList() {
    return (
        <div className="group-list-container">
            <div className="group-list-header-container">
                <FaLayerGroup />
                <h3>Groups</h3>
            </div>
        </div>
    );
}
export default GroupList;