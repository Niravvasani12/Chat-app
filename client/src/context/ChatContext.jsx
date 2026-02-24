import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/service";
import { Prev } from "react-bootstrap/esm/PageItem";

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

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

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId }),
    );
    if (response.error) {
      return console.log("Error creating chat ", response);
    }
    setUserChats((Prev) => [...Prev, response]);
  }, []);

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
