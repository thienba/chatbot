import { memo, useState } from "react";

export const ChatInput = memo(({ onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-md focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
      >
        Send
      </button>
    </form>
  );
});
