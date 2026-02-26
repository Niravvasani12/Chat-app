// import { useState, useEffect, useCallback } from "react";
// import { io } from "socket.io-client";
// import { ChatContext } from "./ChatContext";
// import { baseUrl, getRequest, postRequest } from "../utils/service";

// /* ✅ Create socket ONCE outside component */
// const socket = io("http://localhost:3000");

// const ChatContextProvider = ({ children, user }) => {
//   const [userChats, setUserChats] = useState([]);
//   const [isUserChatsLoading, setUserChatsLoading] = useState(false);
//   const [userChatsError, setUserChatsError] = useState(null);

//   const [allUsers, setAllUsers] = useState([]); // ✅ NEW
//   const [currentChat, setCurrentChat] = useState(null);

//   const [messages, setMessages] = useState([]);
//   const [isMessagesLoading, setIsMessagesLoading] = useState(false);
//   const [messagesError, setMessagesError] = useState(null);

//   const [sendTextMessageError, setSendTextMessageError] = useState(null);
//   const [newMessage, setNewMessage] = useState(null);

//   const [onlineUsers, setOnlineUsers] = useState([]);

//   /* ================= SOCKET ONLINE USERS ================= */
//   useEffect(() => {
//     if (!user?._id) return;

//     socket.emit("addNewUser", user._id);

//     const handleOnlineUsers = (res) => {
//       setOnlineUsers(res);
//     };

//     socket.on("getOnlineUsers", handleOnlineUsers);

//     return () => {
//       socket.off("getOnlineUsers", handleOnlineUsers);
//     };
//   }, [user?._id]);

//   /* ================= SOCKET SEND MESSAGE ================= */
//   useEffect(() => {
//     if (!newMessage || !currentChat) return;

//     const recipientId = currentChat?.members?.find((id) => id !== user?._id);

//     socket.emit("sendMessage", {
//       ...newMessage,
//       recipientId,
//     });
//   }, [newMessage, currentChat, user]);

//   /* ================= GET USER CHATS ================= */
//   useEffect(() => {
//     const getUserChats = async () => {
//       if (!user?._id) return;

//       setUserChatsLoading(true);
//       setUserChatsError(null);

//       const response = await getRequest(`${baseUrl}/chats/${user._id}`);

//       setUserChatsLoading(false);

//       if (response?.error) return setUserChatsError(response);

//       setUserChats(response);
//     };

//     getUserChats();
//   }, [user]);

//   /* ================= GET ALL USERS ================= */
//   useEffect(() => {
//     const getUsers = async () => {
//       if (!user?._id) return;

//       const response = await getRequest(`${baseUrl}/users`);
//       if (response?.error) return;

//       const filteredUsers = response.filter((u) => u._id !== user._id);

//       setAllUsers(filteredUsers);
//     };

//     getUsers();
//   }, [user]);

//   /* ================= GET MESSAGES ================= */
//   useEffect(() => {
//     const getMessages = async () => {
//       if (!currentChat?._id) {
//         setMessages([]);
//         return;
//       }

//       setIsMessagesLoading(true);
//       setMessagesError(null);

//       const response = await getRequest(
//         `${baseUrl}/messages/${currentChat._id}`,
//       );

//       setIsMessagesLoading(false);

//       if (response?.error) {
//         setMessagesError(response);
//         return;
//       }

//       setMessages(response);
//     };

//     getMessages();
//   }, [currentChat]);

//   /* ================= SEND MESSAGE ================= */
//   const sendTextMessage = useCallback(
//     async (textMessage, sender, currentChatId, setTextMessage) => {
//       if (!textMessage) return;

//       const response = await postRequest(
//         `${baseUrl}/messages`,
//         JSON.stringify({
//           chatId: currentChatId,
//           senderId: sender._id,
//           text: textMessage,
//         }),
//       );

//       if (response?.error) {
//         return setSendTextMessageError(response);
//       }

//       setNewMessage(response);
//       setMessages((prev) => [...prev, response]);
//       setTextMessage("");
//     },
//     [],
//   );

//   /* ================= UPDATE CURRENT CHAT ================= */
//   const updateCurrentChat = useCallback((chat) => {
//     setCurrentChat(chat);
//   }, []);

//   /* ================= CREATE CHAT ================= */
//   const createChat = useCallback(async (firstId, secondId) => {
//     const response = await postRequest(
//       `${baseUrl}/chats`,
//       JSON.stringify({ firstId, secondId }),
//     );

//     if (response?.error) return;

//     setUserChats((prev) => [...prev, response]);
//     setCurrentChat(response); // ✅ auto open chat
//   }, []);

//   return (
//     <ChatContext.Provider
//       value={{
//         userChats,
//         isUserChatsLoading,
//         userChatsError,
//         allUsers, // ✅ now showing all users
//         createChat,
//         updateCurrentChat,
//         messages,
//         currentChat,
//         isMessagesLoading,
//         messagesError,
//         sendTextMessage,
//         sendTextMessageError,
//         newMessage,
//         onlineUsers,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export default ChatContextProvider;
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
      // Only for current chat
      if (!currentChat?._id) return;
      if (res.chatId !== currentChat._id) return;

      // Prevent duplicate (sender already added)
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
      if (!response?.error) setUserChats(response);
    };

    fetchChats();
  }, [user]);

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

      // Add to sender UI immediately
      setMessages((prev) => [...prev, response]);

      // Trigger socket send
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
