import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import avartar from "../../assets/avartar.svg";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipient(chat, user);

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-3 justify-content-between"
      role="button"
    >
      {/* LEFT SIDE */}
      <div className="d-flex align-items-center gap-2">
        <div className="me-2">
          <img src={avartar} alt="avatar" className="user-avatar-img" />
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
        <div className="date small text-muted">12/12/2022</div>
        <div className="this-user-notification">2</div>
        <div className="user-online"></div>
      </div>
    </Stack>
  );
};

export default UserChat;
