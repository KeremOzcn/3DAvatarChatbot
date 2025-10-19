import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { config } from "@/utils/config";
import { IconButton } from "./iconButton";

export const AssistantText = ({ message }: { message: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [unlimited, setUnlimited] = useState(false)

  // Replace all of the emotion tag in message with ""
  message = message.replace(/\[(.*?)\]/g, "");

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });

  return (
    <div className="fixed bottom-0 left-0 mb-24 w-full px-4">
      <div className="mx-auto max-w-4xl w-full">
        <div className="relative">
          {/* Mesaj Balonu */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
            {/* Header */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-primary via-blue-600 to-accent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar/Icon */}
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {config('name').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Name */}
                  <div>
                    <h3 className="text-white font-bold text-lg tracking-wide">
                      {config('name')}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-slow"></div>
                      <span className="text-white/80 text-xs">Çevrimiçi</span>
                    </div>
                  </div>
                </div>
                {/* Expand Button */}
                <button
                  onClick={() => setUnlimited(!unlimited)}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 flex items-center justify-center active:scale-95"
                >
                  <IconButton
                    iconName="24/FrameSize"
                    className="bg-transparent hover:bg-transparent active:bg-transparent disabled:bg-transparent"
                    isProcessing={false}
                    onClick={() => {}}
                  />
                </button>
              </div>
            </div>

            {/* Message Content */}
            <div className={clsx(
              "px-6 py-5 overflow-y-auto scroll-smooth",
              unlimited ? 'max-h-[calc(70vh)]' : 'max-h-40',
            )}>
              <div className="min-h-8 text-gray-800 text-base leading-relaxed">
                {message.replace(/\[([a-zA-Z]*?)\]/g, "")}
                <div ref={scrollRef} />
              </div>
            </div>

            {/* Gradient Bottom Border */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-primary/30 blur-sm"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-accent/30 blur-sm"></div>
        </div>
      </div>
    </div>
  );
};

