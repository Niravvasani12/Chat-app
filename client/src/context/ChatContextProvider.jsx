import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { ChatContext } from "./ChatContext";
import { baseUrl, getRequest, postRequest } from "../utils/service";

/* ✅ Create socket ONCE */
const socket = io("http://localhost:3000");

const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  /* ================= ONLINE USERS ================= */
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("addNewUser", user._id);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [user]);

  /* ================= SEND MESSAGE SOCKET ================= */
  useEffect(() => {
    if (!newMessage || !currentChat) return;

    const recipientId = currentChat.members.find((id) => id !== user._id);

    socket.emit("sendMessage", {
      ...newMessage,
      recipientId,
    });
  }, [newMessage, currentChat, user]);

  /* ================= RECEIVE MESSAGE SOCKET ================= */
  useEffect(() => {
    socket.on("getMessage", (res) => {
      if (!currentChat?._id) return;
      if (res.chatId !== currentChat._id) return;
      if (res.senderId === user._id) return;

      setMessages((prev) => [...prev, res]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [currentChat, user]);

  /* ================= GET USER CHATS ================= */
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?._id) return;

      const response = await getRequest(`${baseUrl}/chats/${user._id}`);
      if (!response?.error) {
        setUserChats(response);
      }
    };

    fetchChats();
  }, [user]);

  /* ✅ AUTO SELECT FIRST CHAT WHEN CHATS LOAD */
  useEffect(() => {
    if (userChats.length > 0 && !currentChat) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentChat(userChats[0]);
    }
  }, [userChats, currentChat]);

  /* ================= GET ALL USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?._id) return;

      const response = await getRequest(`${baseUrl}/users`);
      if (!response?.error) {
        setAllUsers(response.filter((u) => u._id !== user._id));
      }
    };

    fetchUsers();
  }, [user]);

  /* ================= GET MESSAGES ================= */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat?._id) {
        setMessages([]);
        return;
      }

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat._id}`,
      );

      if (!response?.error) setMessages(response);
    };

    fetchMessages();
  }, [currentChat]);

  /* ================= SEND MESSAGE ================= */
  const sendTextMessage = useCallback(
    async (textMessage, sender, chatId, setTextMessage) => {
      if (!textMessage) return;

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId,
          senderId: sender._id,
          text: textMessage,
        }),
      );

      if (response?.error) return;

      setMessages((prev) => [...prev, response]);
      setNewMessage(response);
      setTextMessage("");
    },
    [],
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId }),
    );

    if (response?.error) return;

    setUserChats((prev) => [...prev, response]);
    setCurrentChat(response);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        allUsers,
        createChat,
        updateCurrentChat,
        messages,
        currentChat,
        sendTextMessage,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
