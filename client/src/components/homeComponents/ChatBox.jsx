import { useContext } from "react";
import { HomeContext } from "../../contexts/HomeContext";

const ChatBox = ({ chatUser }) => {
    return (
        <div className="column">
            <span className="content has-text-light">
                {chatUser?chatUser.name:"CHAtUSER"}
            </span>
        </div>
    )
}
export default ChatBox;