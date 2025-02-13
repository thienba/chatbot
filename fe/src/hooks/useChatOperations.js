import { useState, useEffect, useCallback } from "react";
import { INITIAL_MESSAGE, API_ENDPOINTS } from "../constants";

export const useChatOperations = () => {
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleStreamResponse = async (response, setChatHistory) => {
    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let tempMessage = "";

    setChatHistory((prev) => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const content = line.slice(6);
          if (content === "[DONE]") break;
          const newContent = tempMessage + content;
          tempMessage = newContent;

          setChatHistory((prev) => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = {
              role: "assistant",
              content: newContent
            };
            return newHistory;
          });
        }
      }
    }
  };

  const handleErrorResponse = (setChatHistory) => {
    setChatHistory(prev => {
      const newHistory = prev.filter(msg => msg.content !== "");
      return [...newHistory, {
        role: "assistant",
        content: "Sorry, there was an error processing your request."
      }];
    });
  };

  const handleMessageSubmit = useCallback(async (message) => {
    const userMessage = { role: "user", content: message };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, chat_id: "default" }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      await handleStreamResponse(response, setChatHistory);
    } catch (error) {
      console.error("Error:", error);
      handleErrorResponse(setChatHistory);
    }
  }, []);

  const loadChatHistory = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CHAT_HISTORY);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.status === "success" && data.data.history) {
        setChatHistory(data.data.history);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setChatHistory([INITIAL_MESSAGE]);
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  return {
    chatHistory,
    setChatHistory,
    handleMessageSubmit,
    clearHistory,
    loadChatHistory,
  };
};
