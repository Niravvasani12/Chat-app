import { useState, useEffect, useCallback } from "react";
import { ChatContext } from "./ChatContext";
import { baseUrl, getRequest, postRequest } from "../utils/service";

const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  // ------------------ GET USER CHATS ------------------
  useEffect(() => {
    const getUserChats = async () => {
      if (!user?._id) return;

      setUserChatsLoading(true);
      setUserChatsError(null);

      const response = await getRequest(`${baseUrl}/chats/${user._id}`);

      setUserChatsLoading(false);

      if (response?.error) {
        return setUserChatsError(response);
      }

      setUserChats(response);
    };

    getUserChats();
  }, [user]);

  // ------------------ GET MESSAGES ------------------
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

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId }),
    );

    if (response?.error) {
      return console.log("Error creating chat ", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  // ------------------ GET USERS ------------------
  useEffect(() => {
    const getUsers = async () => {
      if (!user?._id) return;

      const response = await getRequest(`${baseUrl}/users`);

      if (response?.error) {
        return console.log("Error fetching users:", response);
      }

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
