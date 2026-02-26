import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);

  const { allUsers, userChats, createChat, updateCurrentChat, onlineUsers } =
    useContext(ChatContext);

  const handleUserClick = (u) => {
    // Check if chat already exists
    const existingChat = userChats.find((chat) => chat.members.includes(u._id));

    if (existingChat) {
      // Open existing chat
      updateCurrentChat(existingChat);
    } else {
      // Create new chat
      createChat(user._id, u._id);
    }
  };

  return (
    <div className="all-users">
      {allUsers?.map((u) => {
        const isOnline = onlineUsers?.some(
          (onlineUser) => onlineUser.userId === u._id,
        );

        return (
          <div
            className="single-user"
            key={u._id}
            onClick={() => handleUserClick(u)}
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
