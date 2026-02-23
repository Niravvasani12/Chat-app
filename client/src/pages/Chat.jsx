import { useContext } from "react";
import { ChatContext } from "../context/chatContext";
import { Container, Stack, Row, Col } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading } = useContext(ChatContext);

  return (
    <Container
      fluid
      className="mt-4"
      style={{ maxWidth: "1200px" }} // ✅ center + limit width
    >
      <Row>
        {/* LEFT SIDE - USER CHATS */}
        <Col md={4} className="messages-box">
          <Stack gap={3}>
            {isUserChatsLoading && <p>Loading chats...</p>}

            {userChats?.map((chat, index) => (
              <UserChat key={index} chat={chat} user={user} />
            ))}
          </Stack>
        </Col>

        {/* RIGHT SIDE - CHAT BOX */}
        <Col>
          <div
            style={{
              backgroundColor: "#1e1e1e",
              height: "75vh",
              borderRadius: "8px",
              padding: "20px",
              color: "white",
            }}
          >
            ChatBox
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
