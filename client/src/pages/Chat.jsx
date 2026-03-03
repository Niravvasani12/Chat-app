import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading } = useContext(ChatContext);

  return (
    <Container>
      <PotentialChats />

      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          {/* LEFT SIDE - CHAT LIST */}
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p> Loading chats...</p>}

            {userChats?.map((chat) => {
              return <UserChat key={chat._id} chat={chat} user={user} />;
            })}
          </Stack>

          {/* RIGHT SIDE - CHAT BOX */}
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
