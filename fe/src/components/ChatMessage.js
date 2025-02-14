import { memo } from "react";

export const ChatMessage = memo(({ role, content }) => {
  const isAssistant = role === "assistant";

  return (
    <div className="flex gap-3 my-4 text-gray-600 text-sm">
      <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
        <div className="rounded-full bg-gray-100 border size-8 flex items-center justify-center">
          {isAssistant ? (
            <span>🧬</span>
          ) : (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                fill="currentColor"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          )}
        </div>
      </span>
      <div className="flex-1">
        <p className="font-medium">{isAssistant ? "Assistant" : "You"}</p>
        <p className="mt-1 whitespace-pre-wrap">
          {isAssistant ? content.replace(/(\d+\.)/g, "\n$1").trim() : content}
        </p>
      </div>
    </div>
  );
});
