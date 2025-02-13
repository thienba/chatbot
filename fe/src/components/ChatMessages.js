import { memo } from "react";
import { ChatMessage } from "./ChatMessage";

export const ChatMessages = memo(({ messages, containerRef }) => (
  <div ref={containerRef} className="h-[450px] overflow-y-auto mb-4 space-y-4">
    {messages.map((message, index) => (
      <ChatMessage key={index} role={message.role} content={message.content} />
    ))}
  </div>
));
