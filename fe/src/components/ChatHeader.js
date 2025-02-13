import { memo } from "react";

export const ChatHeader = memo(({ onClear }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">Chat</h2>
    <button
      onClick={onClear}
      className="text-sm text-gray-500 hover:text-gray-700"
    >
      Clear
    </button>
  </div>
));
