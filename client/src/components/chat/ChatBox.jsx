import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import InputEmoji from "react-input-emoji"; // ✅ FIXED
import moment from "moment";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);

  const { recipientUser } = useFetchRecipient(currentChat, user);

  const [textMessage, setTextMessage] = useState("");
  console.log("Current Chat:", currentChat);
  console.log("Messages:", messages);
  console.log("User:", user);
  if (!currentChat) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No Conversation Selected yet...
      </p>
    );
  }

  if (isMessagesLoading) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading chat...</p>
    );
  }

  return (
    <Stack gap={4} className="chat-box">
      {/* Header */}
      <div className="chat-header">
        <strong>{recipientUser?.name || "Chat"}</strong>
      </div>

      {/* Messages */}
      <Stack gap={3} className="messages">
        {/* {(!messages || messages.length === 0) && (
          <Stack className="message align-self-start flex-grow-0">
            <span>Hello 👋</span>
            <span className="message-footer">{moment().calendar()}</span>
          </Stack>
        )} */}

        {messages?.map((message) => (
          <Stack
            key={message._id}
            className={
              message?.senderId?.toString() === user?._id?.toString()
                ? "message self align-self-end flex-grow-0"
                : "message align-self-start flex-grow-0"
            }
          >
            <span>{message.text}</span>
            <span className="message-footer">
              {moment(message.createdAt).calendar()}
            </span>
          </Stack>
        ))}
      </Stack>

      {/* Input */}
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="Nunito"
          borderColor="rgba(72, 112, 223, 0.2)"
        />

        <button className="send-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
          </svg>{" "}
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
