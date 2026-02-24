import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading } = useContext(ChatContext);

  return (
    <Container>
      <PotentialChats />

      {isUserChatsLoading && <p>Loading chats...</p>}

      {userChats && userChats.length > 0 && (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {userChats.map((chat, index) => (
              <UserChat key={index} chat={chat} user={user} />
            ))}
          </Stack>

          <p>ChatBox</p>
        </Stack>
      )}
    </Container>
  );
};

export default Chat;

// <Container fluid className="mt-4" style={{ maxWidth: "1200px" }}>
//   <Row>
//     {/* LEFT SIDE - USER CHATS */}
//     <Col md={4} className="messages-box">
//       <Stack gap={3}>
//         {isUserChatsLoading && <p>Loading chats...</p>}

//         {userChats?.map((chat, index) => (
//           <UserChat key={index} chat={chat} user={user} />
//         ))}
//       </Stack>
//     </Col>

//     <Col>
//       <div
//         style={{
//           backgroundColor: "#1e1e1e",
//           height: "75vh",
//           borderRadius: "8px",
//           padding: "20px",
//           color: "white",
//         }}
//       >
//         ChatBox
//       </div>
//     </Col>
//   </Row>
// </Container>
