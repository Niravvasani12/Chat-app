import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import avartar from "../../assets/avartar.svg";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (onlineUser) => onlineUser.userId === recipientUser?._id,
  );

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-3 justify-content-between"
      role="button"
    >
      {/* LEFT SIDE */}
      <div className="d-flex align-items-center gap-2">
        <div className="me-2 position-relative">
          <img src={avartar} alt="avatar" className="user-avatar-img" />

          {isOnline && <div className="user-online"></div>}
        </div>

        <div className="text-content">
          <div className="name fw-bold">
            {recipientUser?.name || "Loading..."}
          </div>
          <div className="text text-muted">Text Message</div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="d-flex flex-column align-items-end">
        {/* <div className="date small text-muted">12/12/2022</div> */}
        {/* <div className="this-user-notification">2</div> */}
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
