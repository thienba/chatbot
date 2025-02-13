import { useEffect, useRef } from "react";

export const useScrollToBottom = (chatHistory) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return { chatContainerRef };
};
