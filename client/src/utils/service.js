export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        error: true,
        message: data?.message || "Something went wrong",
      };
    }

    return data;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return {
      error: true,
      message: "Server not responding",
    };
  }
};
