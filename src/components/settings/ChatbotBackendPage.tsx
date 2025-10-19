import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getWindowAI } from "window.ai";
import { BasicPage, Link, FormRow, getLinkFromPage } from './common';
import { updateConfig } from "@/utils/config";
import { isTauri } from "@/utils/isTauri";

const chatbotBackends = [
  {key: "echo",       label: "Echo"},
  {key: "arbius_llm", label: "Arbius"},
  {key: "chatgpt",    label: "ChatGPT"},
  {key: "llamacpp",   label: "LLama.cpp"},
  ...isTauri() ? [] : [{key: "windowai", label: "Window.ai"}], // Hides Window.ai when using the desktop app
  {key: "ollama",     label: "Ollama"},
  {key: "koboldai",   label: "KoboldAI"},
  {key: "moshi",      label: "Moshi"},
  {key: "openrouter", label: "OpenRouter"},
  {key: "gemini",     label: "Gemini"},
];

function idToTitle(id: string): string {
  return chatbotBackends[chatbotBackends.findIndex((engine) => engine.key === id)].label;
}

export function ChatbotBackendPage({
  chatbotBackend,
  setChatbotBackend,
  setSettingsUpdated,
  setPage,
  breadcrumbs,
  setBreadcrumbs,
}: {
  chatbotBackend: string;
  setChatbotBackend: (backend: string) => void;
  setSettingsUpdated: (updated: boolean) => void;
  setPage: (page: string) => void;
  breadcrumbs: Link[];
  setBreadcrumbs: (breadcrumbs: Link[]) => void;
}) {
  const { t } = useTranslation();
  const [windowAiDetected, setWindowAiDetected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const windowAI = await getWindowAI();
        if (windowAI) {
          setWindowAiDetected(true);
        }
      } catch(e) {
        console.error("window.ai", e)
      }
    })();
  }, []);

  // Hızlı geçiş butonlarının handler'ları
  const switchToGemini = async () => {
    // Backend'i gemini yap ve önerilen modeli ayarla
    setChatbotBackend("gemini");
    await updateConfig("chatbot_backend", "gemini");
    await updateConfig("gemini_model", "gemini-2.5-flash");
    setSettingsUpdated(true);
    // İstersen otomatik yapılandırma ekranına da gönderebilirsin:
    // setPage("gemini_settings");
    // setBreadcrumbs(breadcrumbs.concat([getLinkFromPage("gemini_settings")]));
  };

  const switchToQwenOllama = async () => {
    // Backend'i ollama yap ve önerilen Qwen modelini ayarla
    setChatbotBackend("ollama");
    await updateConfig("chatbot_backend", "ollama");
    await updateConfig("ollama_model", "qwen3:8b");
    setSettingsUpdated(true);
    // İstersen otomatik yapılandırma ekranına da gönderebilirsin:
    // setPage("ollama_settings");
    // setBreadcrumbs(breadcrumbs.concat([getLinkFromPage("ollama_settings")]));
  };

  return (
    <BasicPage
      title={t("Chatbot Backend")}
      description={t("Chatbot_Backend_desc", "Select the chatbot backend to use. Echo simply responds with what you type, it is used for testing and demonstration. ChatGPT is a commercial chatbot API from OpenAI, however there are multiple compatible API providers which can be used in lieu of OpenAI. LLama.cpp is a free and open source chatbot backend.")}
    >
      <ul role="list" className="divide-y divide-gray-100 max-w-xs">
        {/* Hızlı Geçiş Butonları */}
        <li className="py-4">
          <FormRow label={t("Hızlı Geçiş")}>
            <div className="mt-2 flex flex-col gap-2">
              <button
                type="button"
                className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={switchToGemini}
              >
                {t("Gemini 2.5 Flash’a geç")}
              </button>
              <button
                type="button"
                className="rounded bg-gray-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700"
                onClick={switchToQwenOllama}
              >
                {t("Qwen3:8b (Ollama)’ya geç")}
              </button>
              <div className="text-[11px] text-gray-500">
                {t("Şu an seçili")}: <span className="font-semibold">{t(idToTitle(chatbotBackend))}</span>
              </div>
            </div>
          </FormRow>
        </li>

        {/* Mevcut dropdown ile ayrıntılı seçim */}
        <li className="py-4">
          <FormRow label={t("Chatbot Backend")}>
            <select
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={chatbotBackend}
              onChange={(event: React.ChangeEvent<any>) => {
                setChatbotBackend(event.target.value);
                updateConfig("chatbot_backend", event.target.value);
                setSettingsUpdated(true);
              }}
            >
              {chatbotBackends.map((engine) => (
                <option key={engine.key} value={engine.key}>{t(engine.label)}</option>
              ))}
            </select>
          </FormRow>
        </li>

        { ["arbius_llm", "chatgpt", "llamacpp", "ollama", "koboldai", "moshi", "gemini"].includes(chatbotBackend) && (
          <li className="py-4">
            <FormRow label={`${t("Configure")} ${t(idToTitle(chatbotBackend))}`}>
              <button
                type="button"
                className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  setPage(`${chatbotBackend}_settings`);
                  setBreadcrumbs(breadcrumbs.concat([getLinkFromPage(`${chatbotBackend}_settings`)]));
                }}
              >
                {t("Click here to configure")} {t(idToTitle(chatbotBackend))}
              </button>
            </FormRow>
          </li>
        )}

        { chatbotBackend === 'windowai' && ! windowAiDetected && (
          <li className="py-4">
            <FormRow label="Window.ai not found">
              <a
                href="https://windowai.io/"
                target="_blank"
                className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Install window.ai
              </a>
            </FormRow>
          </li>
        )}
      </ul>
    </BasicPage>
  );
}