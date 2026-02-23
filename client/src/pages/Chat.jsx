import { useContext } from "react";
import { ChatContext } from "../context/chatContext";

const Chat = () => {
  const { userChats } = useContext(ChatContext);

  console.log("UserChats:", userChats);

  return <div>Chats Page</div>;
};

export default Chat;
