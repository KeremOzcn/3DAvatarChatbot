import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Transition } from "@headlessui/react";
import {
  ChevronRightIcon,
  ArrowUturnLeftIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { TextButton } from "@/components/textButton";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { config, updateConfig } from "@/utils/config";
import { useVrmStoreContext } from "@/features/vrmStore/vrmStoreContext";

import { Link } from "./settings/common";

import { MenuPage } from "./settings/MenuPage";
import { LanguagePage } from "./settings/LanguagePage";
import { ResetSettingsPage } from "./settings/ResetSettingsPage";

import { BackgroundImgPage } from "./settings/BackgroundImgPage";
import { BackgroundVideoPage } from "./settings/BackgroundVideoPage";
import { CharacterModelPage } from "./settings/CharacterModelPage";
import { CharacterAnimationPage } from "./settings/CharacterAnimationPage";

import { ChatbotBackendPage } from "./settings/ChatbotBackendPage";
import { OllamaSettingsPage } from "./settings/OllamaSettingsPage";
import { GeminiSettingsPage } from "./settings/GeminiSettingsPage";

import { TTSBackendPage } from "./settings/TTSBackendPage";
import { ElevenLabsSettingsPage } from "./settings/ElevenLabsSettingsPage";

import { STTBackendPage } from "./settings/STTBackendPage";
import { STTWakeWordSettingsPage } from "./settings/STTWakeWordSettingsPage";
import { WhisperCppSettingsPage } from "./settings/WhisperCppSettingsPage";

import { NamePage } from "./settings/NamePage";
import { SystemPromptPage } from "./settings/SystemPromptPage";

export interface SettingsProps {
  onClickClose: () => void;
  disableOutsideClose?: boolean;
}

export const Settings: React.FC<SettingsProps> = ({
  onClickClose,
  disableOutsideClose = false,
}) => {
  const { viewer } = useContext(ViewerContext);
  const { vrmList, vrmListAddFile } = useVrmStoreContext();
  useKeyboardShortcut("Escape", onClickClose);

  const [page, setPage] = useState<string>("main_menu");
  const [breadcrumbs, setBreadcrumbs] = useState<Link[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [settingsUpdated, setSettingsUpdated] = useState(false);

  // ==== STATE (Kodunu korudum) ====
  const [chatbotBackend, setChatbotBackend] = useState(config("chatbot_backend"));
  const [arbiusLLMModelId, setArbiusLLMModelId] = useState(
    config("arbius_llm_model_id"),
  );
  const [openAIApiKey, setOpenAIApiKey] = useState(config("openai_apikey"));
  const [openAIUrl, setOpenAIUrl] = useState(config("openai_url"));
  const [openAIModel, setOpenAIModel] = useState(config("openai_model"));
  const [llamaCppUrl, setLlamaCppUrl] = useState(config("llamacpp_url"));
  const [llamaCppStopSequence, setLlamaCppStopSequence] = useState(
    config("llamacpp_stop_sequence"),
  );
  const [ollamaUrl, setOllamaUrl] = useState(config("ollama_url"));
  const [ollamaModel, setOllamaModel] = useState(config("ollama_model"));
  const [koboldAiUrl, setKoboldAiUrl] = useState(config("koboldai_url"));
  const [koboldAiUseExtra, setKoboldAiUseExtra] = useState<boolean>(
    config("koboldai_use_extra") === "true",
  );
  const [koboldAiStopSequence, setKoboldAiStopSequence] = useState(
    config("koboldai_stop_sequence"),
  );
  const [moshiUrl, setMoshiUrl] = useState(config("moshi_url"));
  const [openRouterApiKey, setOpenRouterApiKey] = useState(
    config("openrouter_apikey"),
  );
  const [openRouterUrl, setOpenRouterUrl] = useState(config("openrouter_url"));
  const [openRouterModel, setOpenRouterModel] = useState(
    config("openrouter_model"),
  );
  const [geminiModel, setGeminiModel] = useState(config("gemini_model")); // ekle

  const [ttsBackend, setTTSBackend] = useState(config("tts_backend"));
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState(
    config("elevenlabs_apikey"),
  );
  const [elevenlabsVoiceId, setElevenlabsVoiceId] = useState(
    config("elevenlabs_voiceid"),
  );
  const [speechT5SpeakerEmbeddingsUrl, setSpeechT5SpeakerEmbeddingsUrl] =
    useState(config("speecht5_speaker_embedding_url"));
  const [openAITTSApiKey, setOpenAITTSApiKey] = useState(
    config("openai_tts_apikey"),
  );
  const [openAITTSUrl, setOpenAITTSUrl] = useState(config("openai_tts_url"));
  const [openAITTSModel, setOpenAITTSModel] = useState(
    config("openai_tts_model"),
  );
  const [openAITTSVoice, setOpenAITTSVoice] = useState(
    config("openai_tts_voice"),
  );
  const [piperUrl, setPiperUrl] = useState(config("piper_url"));

  const [rvcUrl, setRvcUrl] = useState(config("rvc_url"));
  const [rvcEnabled, setRvcEnabled] = useState<boolean>(
    config("rvc_enabled") === "true",
  );
  const [rvcModelName, setRvcModelName] = useState(config("rvc_model_name"));
  const [rvcIndexPath, setRvcIndexPath] = useState(config("rvc_index_path"));
  const [rvcF0upKey, setRvcF0UpKey] = useState<number>(
    parseInt(config("rvc_f0_upkey")),
  );
  const [rvcF0Method, setRvcF0Method] = useState(config("rvc_f0_method"));
  const [rvcIndexRate, setRvcIndexRate] = useState(config("rvc_index_rate"));
  const [rvcFilterRadius, setRvcFilterRadius] = useState<number>(
    parseInt(config("rvc_filter_radius")),
  );
  const [rvcResampleSr, setRvcResampleSr] = useState<number>(
    parseInt(config("rvc_resample_sr")),
  );
  const [rvcRmsMixRate, setRvcRmsMixRate] = useState<number>(
    parseInt(config("rvc_rms_mix_rate")),
  );
  const [rvcProtect, setRvcProtect] = useState<number>(
    parseInt(config("rvc_protect")),
  );

  const [coquiLocalUrl, setCoquiLocalUrl] = useState(config("coquiLocal_url"));
  const [coquiLocalVoiceId, setCoquiLocalVoiceId] = useState(
    config("coquiLocal_voiceid"),
  );

  const [localXTTSUrl, setLocalXTTSUrl] = useState(config("localXTTS_url"));

  const [kokoroUrl, setKokoroUrl] = useState(config("kokoro_url"));
  const [kokoroVoice, setKokoroVoice] = useState(config("kokoro_voice"));

  const [visionBackend, setVisionBackend] = useState(config("vision_backend"));
  const [visionLlamaCppUrl, setVisionLlamaCppUrl] = useState(
    config("vision_llamacpp_url"),
  );
  const [visionOllamaUrl, setVisionOllamaUrl] = useState(
    config("vision_ollama_url"),
  );
  const [visionOllamaModel, setVisionOllamaModel] = useState(
    config("vision_ollama_model"),
  );
  const [visionOpenAIApiKey, setVisionOpenAIApiKey] = useState(
    config("vision_openai_apikey"),
  );
  const [visionOpenAIUrl, setVisionOpenAIUrl] = useState(
    config("vision_openai_url"),
  );
  const [visionOpenAIModel, setVisionOpenAIModel] = useState(
    config("vision_openai_model"),
  );
  const [visionSystemPrompt, setVisionSystemPrompt] = useState(
    config("vision_system_prompt"),
  );

  const [bgUrl, setBgUrl] = useState(config("bg_url"));
  const [bgColor, setBgColor] = useState(config("bg_color"));
  const [vrmUrl, setVrmUrl] = useState(config("vrm_url"));
  const [vrmHash, setVrmHash] = useState(config("vrm_hash"));
  const [vrmSaveType, setVrmSaveType] = useState(config("vrm_save_type"));
  const [youtubeVideoID, setYoutubeVideoID] = useState(
    config("youtube_videoid"),
  );
  const [animationUrl, setAnimationUrl] = useState(config("animation_url"));
  const [animationProcedural, setAnimationProcedural] = useState<boolean>(
    config("animation_procedural") === "true",
  );

  const [sttBackend, setSTTBackend] = useState(config("stt_backend"));
  const [sttWakeWordEnabled, setSTTWakeWordEnabled] = useState<boolean>(
    config("wake_word_enabled") === "true",
  );
  const [sttWakeWord, setSTTWakeWord] = useState(config("wake_word"));
  const [whisperOpenAIUrl, setWhisperOpenAIUrl] = useState(
    config("openai_whisper_url"),
  );
  const [whisperOpenAIApiKey, setWhisperOpenAIApiKey] = useState(
    config("openai_whisper_apikey"),
  );
  const [whisperOpenAIModel, setWhisperOpenAIModel] = useState(
    config("openai_whisper_model"),
  );
  const [whisperCppUrl, setWhisperCppUrl] = useState(config("whispercpp_url"));

  const [amicaLifeEnabled, setAmicaLifeEnabled] = useState<boolean>(
    config("amica_life_enabled") === "true",
  );
  const [timeBeforeIdle, setTimeBeforeIdle] = useState<number>(
    parseInt(config("time_before_idle_sec")),
  );
  const [minTimeInterval, setMinTimeInterval] = useState<number>(
    parseInt(config("min_time_interval_sec")),
  );
  const [maxTimeInterval, setMaxTimeInterval] = useState<number>(
    parseInt(config("max_time_interval_sec")),
  );
  const [timeToSleep, setTimeToSleep] = useState<number>(
    parseInt(config("time_to_sleep_sec")),
  );
  const [idleTextPrompt, setIdleTextPrompt] = useState(
    config("idle_text_prompt"),
  );

  const [reasoningEngineEnabled, setReasoningEngineEnabled] = useState<boolean>(
    config("reasoning_engine_enabled") === "true",
  );
  const [reasoningEngineUrl, setReasoningEngineUrl] = useState(
    config("reasoning_engine_url"),
  );

  const [externalApiEnabled, setExternalApiEnabled] = useState<boolean>(
    config("external_api_enabled") === "true",
  );

  const [name, setName] = useState(config("name"));
  const [systemPrompt, setSystemPrompt] = useState(config("system_prompt"));

  const [debugGfx, setDebugGfx] = useState<boolean>(
    config("debug_gfx") === "true",
  );
  const [mtoonDebugMode, setMtoonDebugMode] = useState(
    config("mtoon_debug_mode"),
  );
  const [mtoonMaterialType, setMtoonMaterialType] = useState(
    config("mtoon_material_type"),
  );
  const [useWebGPU, setUseWebGPU] = useState<boolean>(
    config("use_webgpu") === "true",
  );

  // ==== Refs ====
  const vrmFileInputRef = useRef<HTMLInputElement>(null);
  const bgImgFileInputRef = useRef<HTMLInputElement>(null);
  const topMenuRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLDivElement>(null);
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // ==== Handlers ====
  const handleClickOpenVrmFile = useCallback(() => {
    vrmFileInputRef.current?.click();
  }, []);

  const handleClickOpenBgImgFile = useCallback(() => {
    bgImgFileInputRef.current?.click();
  }, []);

  const handleChangeVrmFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;
      const file = files[0];
      if (!file) return;
      const file_type = file.name.split(".").pop();
      if (file_type === "vrm") {
        vrmListAddFile(file, viewer);
      }
      event.target.value = "";
    },
    [viewer, vrmListAddFile],
  );

  function handleChangeBgImgFile(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (!file) return;
    if (!file.type.match("image.*")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      if (!url) return;
      document.body.style.backgroundImage = `url(${url})`;
      if ((url as string).length < 2_000_000) {
        updateConfig("youtube_videoid", "");
        updateConfig("bg_url", url as string);
        setShowNotification(true);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  // ==== Effects ====
  useEffect(() => {
    if (amicaLifeEnabled && ["echo", "moshi"].includes(config("chatbot_backend"))) {
      setAmicaLifeEnabled(false);
    }
  }, [chatbotBackend, amicaLifeEnabled]);

  useEffect(() => {
    if (!settingsUpdated) return;
    const timeoutId = setTimeout(() => {
      setShowNotification(true);
      const hideId = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(hideId);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [
    settingsUpdated,
    chatbotBackend,
    arbiusLLMModelId,
    openAIApiKey,
    openAIUrl,
    openAIModel,
    llamaCppUrl,
    llamaCppStopSequence,
    ollamaUrl,
    ollamaModel,
    koboldAiUrl,
    koboldAiUseExtra,
    koboldAiStopSequence,
    moshiUrl,
    openRouterApiKey,
    openRouterUrl,
    openRouterModel,
    ttsBackend,
    elevenlabsApiKey,
    elevenlabsVoiceId,
    speechT5SpeakerEmbeddingsUrl,
    openAITTSApiKey,
    openAITTSUrl,
    openAITTSModel,
    openAITTSVoice,
    piperUrl,
    rvcUrl,
    rvcEnabled,
    rvcModelName,
    rvcIndexPath,
    rvcF0upKey,
    rvcF0Method,
    rvcIndexRate,
    rvcFilterRadius,
    rvcResampleSr,
    rvcRmsMixRate,
    rvcProtect,
    coquiLocalUrl,
    coquiLocalVoiceId,
    localXTTSUrl,
    kokoroUrl,
    kokoroVoice,
    visionBackend,
    visionLlamaCppUrl,
    visionOllamaUrl,
    visionOllamaModel,
    visionOpenAIApiKey,
    visionOpenAIUrl,
    visionOpenAIModel,
    visionSystemPrompt,
    bgColor,
    bgUrl,
    vrmHash,
    vrmUrl,
    youtubeVideoID,
    animationUrl,
    animationProcedural,
    sttBackend,
    whisperOpenAIApiKey,
    whisperOpenAIModel,
    whisperOpenAIUrl,
    whisperCppUrl,
    amicaLifeEnabled,
    timeBeforeIdle,
    minTimeInterval,
    maxTimeInterval,
    timeToSleep,
    idleTextPrompt,
    reasoningEngineEnabled,
    reasoningEngineUrl,
    externalApiEnabled,
    name,
    systemPrompt,
    debugGfx,
    mtoonDebugMode,
    mtoonMaterialType,
    useWebGPU,
    sttWakeWordEnabled,
    sttWakeWord,
  ]);

  // Dışarı tıklama (panel modunda)
  useEffect(() => {
    if (disableOutsideClose) return;
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        mainMenuRef.current?.contains(target) ||
        backButtonRef.current?.contains(target) ||
        topMenuRef.current?.contains(target) ||
        notificationsRef.current?.contains(target)
      ) {
        return;
      }
      onClickClose();
    }
    document.addEventListener("click", onDocClick, { capture: true });
    return () => document.removeEventListener("click", onDocClick, { capture: true });
  }, [disableOutsideClose, onClickClose]);

  // ==== Helpers ====
  const changePage = (p: string) => setPage(p);

  function handleMenuClick(link: Link) {
    setPage(link.key);
    setBreadcrumbs((prev) => [...prev, link]);
  }

  function renderPage() {
    switch (page) {
      case "main_menu":
        return (
          <MenuPage
            keys={[
              "appearance",
              "chatbot",
              "language",
              "tts",
              "stt",
              "reset_settings",
            ]}
            menuClick={handleMenuClick}
          />
        );

      case "appearance":
        return (
          <MenuPage
            keys={[
              "background_img",
              "background_video",
              "character_model",
              "character_animation",
            ]}
            menuClick={handleMenuClick}
          />
        );

      case "chatbot":
        return (
          <MenuPage
            keys={[
              "chatbot_backend",
              "name",
              "system_prompt",
              "ollama_settings",
              "gemini_settings",
            ]}
            menuClick={handleMenuClick}
          />
        );

      case "language":
        return <LanguagePage setSettingsUpdated={setSettingsUpdated} />;

      case "tts":
        return (
          <MenuPage
            keys={[
              "tts_backend",
              "elevenlabs_settings",
            ]}
            menuClick={handleMenuClick}
          />
        );

      case "stt":
        return (
          <MenuPage
            keys={[
              "stt_backend",
              "stt_wake_word",
              "whispercpp_settings",
            ]}
            menuClick={handleMenuClick}
          />
        );

      case "reset_settings":
        return <ResetSettingsPage />;

      case "background_img":
        return (
          <BackgroundImgPage
            bgUrl={bgUrl}
            setBgUrl={setBgUrl}
            setSettingsUpdated={setSettingsUpdated}
            handleClickOpenBgImgFile={handleClickOpenBgImgFile}
          />
        );

      case "background_video":
        return (
          <BackgroundVideoPage
            youtubeVideoID={youtubeVideoID}
            setYoutubeVideoID={setYoutubeVideoID}
            setSettingsUpdated={setSettingsUpdated}
          />
        );

      case "character_model":
        return (
          <CharacterModelPage
            viewer={viewer}
            vrmHash={vrmHash}
            vrmUrl={vrmUrl}
            vrmSaveType={vrmSaveType}
            vrmList={vrmList}
            setVrmHash={setVrmHash}
            setVrmUrl={setVrmUrl}
            setVrmSaveType={setVrmSaveType}
            setSettingsUpdated={setSettingsUpdated}
            handleClickOpenVrmFile={handleClickOpenVrmFile}
          />
        );

      case "character_animation":
        return (
          <CharacterAnimationPage
            viewer={viewer}
            animationUrl={animationUrl}
            setAnimationUrl={setAnimationUrl}
            animationProcedural={animationProcedural}
            setAnimationProcedural={setAnimationProcedural}
            setSettingsUpdated={setSettingsUpdated}
          />
        );

      case "chatbot_backend":
        return (
          <ChatbotBackendPage
            chatbotBackend={chatbotBackend}
            setChatbotBackend={setChatbotBackend}
            setSettingsUpdated={setSettingsUpdated}
            setPage={changePage}
            breadcrumbs={breadcrumbs}
            setBreadcrumbs={setBreadcrumbs}
          />
        );

      case "ollama_settings":
        return (
          <OllamaSettingsPage
            ollamaUrl={ollamaUrl}
            setOllamaUrl={setOllamaUrl}
            ollamaModel={ollamaModel}
            setOllamaModel={setOllamaModel}
            setSettingsUpdated={setSettingsUpdated}
          />
        );

      case "gemini_settings":
        return (
          <GeminiSettingsPage
            geminiModel={geminiModel}
            setGeminiModel={setGeminiModel}
            setSettingsUpdated={setSettingsUpdated}
          />
        );

      case "tts_backend":
        return (
          <TTSBackendPage
            ttsBackend={ttsBackend}
            setTTSBackend={setTTSBackend}
            setSettingsUpdated={setSettingsUpdated}
            setPage={changePage}
            breadcrumbs={breadcrumbs}
            setBreadcrumbs={setBreadcrumbs}
          />
        );

      case "elevenlabs_settings":
        return (
          <ElevenLabsSettingsPage
            elevenlabsApiKey={elevenlabsApiKey}
            setElevenlabsApiKey={setElevenlabsApiKey}
            elevenlabsVoiceId={elevenlabsVoiceId}
            setElevenlabsVoiceId={setElevenlabsVoiceId}
            setSettingsUpdated={setSettingsUpdated}
          />
        );

      case "stt_backend":
        return (
          <STTBackendPage
            sttBackend={sttBackend}
            setSTTBackend={setSTTBackend}
            setSettingsUpdated={setSettingsUpdated}
            setPage={changePage}
            breadcrumbs={breadcrumbs}
            setBreadcrumbs={setBreadcrumbs}
          />
        );

      case "stt_wake_word":
        return (
          <STTWakeWordSettingsPage
            sttWakeWordEnabled={sttWakeWordEnabled}
            sttWakeWord={sttWakeWord}
            timeBeforeIdle={timeBeforeIdle}
            setSTTWakeWordEnabled={setSTTWakeWordEnabled}
            setSTTWakeWord={setSTTWakeWord}
            setTimeBeforeIdle={setTimeBeforeIdle}
            setSettingsUpdated={setSettingsUpdated}
          />
        );

      case "whispercpp_settings":
        return (
          <WhisperCppSettingsPage
            whisperCppUrl={whisperCppUrl}
            setWhisperCppUrl={setWhisperCppUrl}
            setSettingsUpdated={setSettingsUpdated}
          />
        );

      case "vision_backend":
        return (
          <VisionBackendPage
            visionBackend={visionBackend}
            setVisionBackend={setVisionBackend}
            setSettingsUpdated={setSettingsUpdated}
            setPage={changePage}
            breadcrumbs={breadcrumbs}
            setBreadcrumbs={setBreadcrumbs}
          />
        );

      case "system_prompt":
        return (
          <SystemPromptPage
            systemPrompt={systemPrompt}
            setSystemPrompt={setSystemPrompt}
            setSettingsUpdated={setSettingsUpdated}
          />
        );

      case "name":
        return (
          <NamePage
            name={name}
            setName={setName}
            setSettingsUpdated={setSettingsUpdated}
          />
        );

      default:
        throw new Error("page not found");
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full max-h-full text-black text-xs text-left z-20 overflow-y-auto backdrop-blur">
      <div className="absolute top-0 left-0 w-full h-full bg-gray-700 opacity-10 z-index-50" />
      <div className="fixed w-full top-0 left-0 z-50 p-2 bg-white" ref={topMenuRef}>
        <nav aria-label="Breadcrumb" className="inline-block ml-4">
          <ol role="list" className="flex items-center space-x-4">
            <li className="flex">
              <div className="flex items-center">
                <span
                  onClick={() => {
                    if (breadcrumbs.length === 0) {
                      onClickClose();
                      return;
                    }
                    setPage("main_menu");
                    setBreadcrumbs([]);
                  }}
                  className="text-gray-400 hover:text-gray-500 cursor-pointer"
                >
                  <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </span>
              </div>
            </li>
            {breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.key} className="flex">
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span
                    onClick={() => {
                      setPage(breadcrumb.key);
                      const nb: Link[] = [];
                      for (const b of breadcrumbs) {
                        nb.push(b);
                        if (b.key === breadcrumb.key) break;
                      }
                      setBreadcrumbs(nb);
                    }}
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {breadcrumb.label}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="h-screen overflow-auto opacity-95 backdrop-blur">
        <div className="mx-auto max-w-2xl py-16 text-text1">
          <div className="mt-12">
            <div className="inline-block pt-4 pr-4" ref={backButtonRef}>
              <TextButton
                className="rounded-b-none text-lg ml-4 px-8 shadow-sm"
                onClick={() => {
                  if (breadcrumbs.length === 0) {
                    onClickClose();
                    return;
                  }
                  if (breadcrumbs.length === 1) {
                    setPage("main_menu");
                    setBreadcrumbs([]);
                    return;
                  }
                  const prevPage = breadcrumbs[breadcrumbs.length - 2];
                  setPage(prevPage.key);
                  setBreadcrumbs(breadcrumbs.slice(0, -1));
                }}
              >
                <ArrowUturnLeftIcon
                  className="h-5 w-5 flex-none text-white"
                  aria-hidden="true"
                />
              </TextButton>
            </div>
            <div ref={mainMenuRef}>{renderPage()}</div>
          </div>
        </div>
      </div>

      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-2"
        ref={notificationsRef}
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={showNotification}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      Successfully saved!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Your settings were updated successfully.
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setShowNotification(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <input
        type="file"
        className="hidden"
        accept=".vrm"
        ref={vrmFileInputRef}
        onChange={handleChangeVrmFile}
      />
      <input
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        ref={bgImgFileInputRef}
        onChange={handleChangeBgImgFile}
      />
    </div>
  );
};