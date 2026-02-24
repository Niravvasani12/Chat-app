import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { potentialChats, createChat } = useContext(ChatContext);

  const { user } = useContext(AuthContext);
  return (
    <div className="all-users">
      {potentialChats?.length === 0 && (
        <p className="text-muted">No users available</p>
      )}

      {potentialChats?.map((u) => (
        <div
          className="single-user"
          key={u._id}
          onClick={() => createChat(user._id, u._id)}
        >
          {u.name}
          <div className="user-online"></div>
        </div>
      ))}
    </div>
  );
};

export default PotentialChats;
