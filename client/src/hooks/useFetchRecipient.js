import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/service";

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members?.find((id) => id !== user?._id) || null;

  useEffect(() => {
    if (!recipientId) return;

    const getUser = async () => {
      try {
        const response = await getRequest(
          `${baseUrl}/users/find/${recipientId}`,
        );

        if (response?.error) {
          setError(response);
        } else {
          setRecipientUser(response);
        }
      } catch (err) {
        setError(err);
      }
    };

    getUser();
  }, [recipientId]);

  return { recipientUser, error };
};
