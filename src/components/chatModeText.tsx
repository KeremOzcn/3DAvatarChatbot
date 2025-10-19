import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { IconButton } from "./iconButton";
import { Message } from "@/features/chat/messages";

export const ChatModeText = ({ messages }: { messages: Message[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [unlimited, setUnlimited] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <div className="fixed bottom-0 left-0 mb-20 w-full">
      <div className="mx-auto max-w-4xl w-full px-4 md:px-16">
        <div className="backdrop-blur-lg rounded-lg">
          <div className="bg-white/70 rounded-lg backdrop-blur-lg shadow-lg">
            <div className="px-8 pr-1 py-3 bg-blue-600/90 rounded-t-lg text-white font-bold tracking-wider">
              <span className="p-4 bg-blue-700/80 rounded-lg rounded-tl-none rounded-tr-none shadow-sm">
                CHAT MODE
              </span>
              <IconButton
                iconName="24/FrameSize"
                className="bg-transparent hover:bg-transparent active:bg-transparent disabled:bg-transparent float-right"
                isProcessing={false}
                onClick={() => setUnlimited(!unlimited)}
              />
            </div>
            <div className={clsx(
              "px-8 py-4 overflow-y-auto",
              unlimited ? 'max-h-[calc(75vh)]' : 'max-h-64',
            )}>
              <div className="min-h-8 max-h-full text-gray-700 typography-14 space-y-3">
                {messages.map((msg, index) => (
                  <div key={index} className={clsx(
                    "p-3 rounded-lg",
                    msg.role === "user" ? "bg-blue-100" : "bg-gray-100"
                  )}>
                    <div className="font-bold text-xs mb-1 uppercase">
                      {msg.role}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
