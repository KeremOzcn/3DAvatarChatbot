import { useEffect, useRef } from "react";

export const ThoughtText = ({ message }: { message: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });

  return (
    <div className="fixed top-20 right-4 max-w-sm">
      <div className="bg-yellow-100/90 backdrop-blur-lg rounded-lg shadow-lg p-4 border-2 border-yellow-400">
        <div className="text-xs font-bold text-yellow-800 mb-2">💭 THINKING...</div>
        <div className="text-sm text-gray-700 italic">
          {message}
          <div ref={scrollRef} />
        </div>
      </div>
    </div>
  );
};
