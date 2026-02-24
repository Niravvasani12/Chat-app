import { createContext, useState, useEffect } from "react";
import { baseUrl, getRequest } from "../utils/service";

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext(); // ✅ MUST CALL ()

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setUserChatsLoading] = useState(false);
  const [UserChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      if (!user?._id) return;

      const response = await getRequest(`${baseUrl}/users`);

      if (response?.error) {
        return console.log("Error Fetching Users", response);
      }

      const pChats = response.filter((u) => u._id !== user._id);

      setPotentialChats(pChats);
    };

    getUsers();
  }, [user]);
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

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        UserChatsError,
        potentialChats, // ✅ add this
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
