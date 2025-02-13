import { memo } from "react";
import { useChatOperations } from "./hooks/useChatOperations";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatIcon } from "./components/ChatIcon";
import { ChatInput } from "./components/ChatInput";
import { useScrollToBottom } from "./hooks/useScrollToBottom";

function App() {
  const { chatHistory, handleMessageSubmit, clearHistory } =
    useChatOperations();

  const { chatContainerRef } = useScrollToBottom(chatHistory);

  return (
    <div>
      <ChatButton />
      <ChatWindow
        chatHistory={chatHistory}
        chatContainerRef={chatContainerRef}
        onClear={clearHistory}
        onSubmit={handleMessageSubmit}
      />
    </div>
  );
}

const ChatButton = memo(() => (
  <button
    className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
    type="button"
    aria-haspopup="dialog"
    aria-expanded="false"
  >
    <ChatIcon />
  </button>
));

const ChatWindow = memo(
  ({ chatHistory, chatContainerRef, onClear, onSubmit }) => (
    <div className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white rounded-lg border border-[#e5e7eb] w-[440px] p-6 shadow-sm">
      <ChatHeader onClear={onClear} />
      <ChatMessages messages={chatHistory} containerRef={chatContainerRef} />
      <ChatInput onSubmit={onSubmit} />
    </div>
  )
);

export default App;
