import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { ChatContext } from "./ChatContext";
import { baseUrl, getRequest, postRequest } from "../utils/service";

/* ✅ Create socket ONCE outside component */
const socket = io("http://localhost:3000");

const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  /* ================= SOCKET ONLINE USERS ================= */
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("addNewUser", user._id);

    const handleOnlineUsers = (res) => {
      setOnlineUsers(res);
    };

    socket.on("getOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, [user?._id]);

  /* ================= GET USER CHATS ================= */
  useEffect(() => {
    const getUserChats = async () => {
      if (!user?._id) return;

      setUserChatsLoading(true);
      setUserChatsError(null);

      const response = await getRequest(`${baseUrl}/chats/${user._id}`);

      setUserChatsLoading(false);

      if (response?.error) return setUserChatsError(response);

      setUserChats(response);
    };

    getUserChats();
  }, [user]);

  /* ================= GET MESSAGES ================= */
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id) {
        setMessages([]);
        return;
      }

      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat._id}`,
      );

      setIsMessagesLoading(false);

      if (response?.error) {
        setMessagesError(response);
        return;
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  /* ================= SEND MESSAGE ================= */
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return;

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        }),
      );

      if (response?.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    [],
  );

  /* ================= UPDATE CURRENT CHAT ================= */
  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  /* ================= CREATE CHAT ================= */
  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId }),
    );

    if (response?.error) return;

    setUserChats((prev) => [...prev, response]);
  }, []);

  /* ================= GET USERS ================= */
  useEffect(() => {
    const getUsers = async () => {
      if (!user?._id) return;

      const response = await getRequest(`${baseUrl}/users`);
      if (response?.error) return;

      const pChats = response.filter((u) => {
        if (u._id === user._id) return false;

        const isChatCreated = userChats?.some((chat) =>
          chat.members.includes(u._id),
        );

        return !isChatCreated;
      });

      setPotentialChats(pChats);
    };

    getUsers();
  }, [user, userChats]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        currentChat,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        sendTextMessageError,
        newMessage,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
