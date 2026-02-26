import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <div className="all-users">
      {potentialChats?.map((u) => {
        const isOnline = onlineUsers?.find(
          (onlineUser) => onlineUser.userId === u._id,
        );

        return (
          <div
            className="single-user"
            key={u._id}
            onClick={() => createChat(user._id, u._id)}
          >
            {u.name}

            {isOnline && <div className="user-online"></div>}
          </div>
        );
      })}
    </div>
  );
};

export default PotentialChats;
