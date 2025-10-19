import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from "react";

export const UserText = ({ message }: { message: string }) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Replace all of the emotion tag in message with ""
  message = message.replace(/\[(.*?)\]/g, "");

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });

  return (
    <div className="fixed bottom-0 left-0 mb-24 w-full flex justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="relative">
          {/* Kullanıcı Mesaj Balonu */}
          <div className="bg-white/55 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👤</span>
                </div>
                {/* Name */}
                <h3 className="text-white font-semibold text-base tracking-wide">
                  {t("YOU")}
                </h3>
              </div>
            </div>

            {/* Message Content */}
            <div className="px-6 py-4 max-h-32 overflow-y-auto scroll-smooth">
              <div className="min-h-8 text-gray-700 text-base leading-relaxed">
                {message.replace(/\[([a-zA-Z]*?)\]/g, "")}
                <div ref={scrollRef} />
              </div>
            </div>

            {/* Bottom Border */}
            <div className="h-1 bg-gradient-to-r from-gray-600 to-gray-700"></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gray-400/30 blur-sm"></div>
        </div>
      </div>
    </div>
  );
};
