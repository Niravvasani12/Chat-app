import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import InputEmoji from "react-input-emoji";
import moment from "moment";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);

  const { recipientUser } = useFetchRecipient(currentChat, user);

  const [textMessage, setTextMessage] = useState("");

  // ✅ Auto Scroll Ref
  const messagesEndRef = useRef(null);

  // ✅ Auto Scroll Effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send Handler (Enter + Click)
  const handleSend = () => {
    if (!textMessage.trim()) return;

    sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
  };

  // ✅ No chat selected
  if (!currentChat) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No Conversation Selected yet...
      </p>
    );
  }

  // ✅ Loading state
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
      <Stack
        gap={3}
        className="messages"
        style={{
          overflowY: "auto",
          maxHeight: "400px",
        }}
      >
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

        <div ref={messagesEndRef} />
      </Stack>

      {/* Input */}
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          placeholder="Enter Text"
          onChange={setTextMessage}
          onEnter={handleSend}
          fontFamily="Nunito"
          borderColor="rgba(72, 112, 223, 0.2)"
        />

        <button className="send-btn" onClick={handleSend}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-send-arrow-up"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15.854.146a.5.5 0 0 1 .11.54l-2.8 7a.5.5 0 1 1-.928-.372l1.895-4.738-7.494 7.494 1.376 2.162a.5.5 0 1 1-.844.537l-1.531-2.407L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM5.93 9.363l7.494-7.494L1.591 6.602z"
            />
            <path
              fillRule="evenodd"
              d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.354a.5.5 0 0 0-.722.016l-1.149 1.25a.5.5 0 1 0 .737.676l.28-.305V14a.5.5 0 0 0 1 0v-1.793l.396.397a.5.5 0 0 0 .708-.708z"
            />
          </svg>
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
