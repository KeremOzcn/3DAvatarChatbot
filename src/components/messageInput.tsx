import * as ort from "onnxruntime-web"
ort.env.wasm.wasmPaths = '/_next/static/chunks/'

import { useContext, useEffect, useRef, useState } from "react";
import { useMicVAD } from "@ricky0123/vad-react"
import { IconButton } from "./iconButton";
import { useTranscriber } from "@/hooks/useTranscriber";
import { cleanTranscript, cleanFromPunctuation, cleanFromWakeWord } from "@/utils/stringProcessing";
import { hasOnScreenKeyboard } from "@/utils/hasOnScreenKeyboard";
import { AlertContext } from "@/features/alert/alertContext";
import { ChatContext } from "@/features/chat/chatContext";
import { openaiWhisper  } from "@/features/openaiWhisper/openaiWhisper";
import { whispercpp  } from "@/features/whispercpp/whispercpp";
import { config } from "@/utils/config";
import { WaveFile } from "wavefile";
import { AmicaLifeContext } from "@/features/amicaLife/amicaLifeContext";
import { AudioControlsContext } from "@/features/moshi/components/audioControlsContext";


export default function MessageInput({
  userMessage,
  setUserMessage,
  isChatProcessing,
  onChangeUserMessage,
}: {
  userMessage: string;
  setUserMessage: (message: string) => void;
  isChatProcessing: boolean;
  onChangeUserMessage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}) {
  const transcriber = useTranscriber();
  const inputRef = useRef<HTMLInputElement>(null);
  const [whisperOpenAIOutput, setWhisperOpenAIOutput] = useState<any | null>(null);
  const [whisperCppOutput, setWhisperCppOutput] = useState<any | null>(null);
  const { chat: bot } = useContext(ChatContext);
  const { alert } = useContext(AlertContext);
  const { amicaLife } = useContext(AmicaLifeContext);
  const { audioControls: moshi } = useContext(AudioControlsContext);
  const [ moshiMuted, setMoshiMuted] = useState(moshi.isMuted());

  const vad = useMicVAD({
    startOnLoad: false,
    onSpeechStart: () => {
      console.debug('vad', 'on_speech_start');
      console.time('performance_speech');
    },
    onSpeechEnd: (audio: Float32Array) => {
      console.debug('vad', 'on_speech_end');
      console.timeEnd('performance_speech');
      console.time('performance_transcribe');
      (window as any).chatvrm_latency_tracker = {
        start: +Date.now(),
        active: true,
      };

      try {
        switch (config("stt_backend")) {
          case 'whisper_browser': {
            console.debug('whisper_browser attempt');
            // since VAD sample rate is same as whisper we do nothing here
            // both are 16000
            const audioCtx = new AudioContext();
            const buffer = audioCtx.createBuffer(1, audio.length, 16000);
            buffer.copyToChannel(audio, 0, 0);
            transcriber.start(buffer);
            break;
          }
          case 'whisper_openai': {
            console.debug('whisper_openai attempt');
            const wav = new WaveFile();
            wav.fromScratch(1, 16000, '32f', audio);
            const file = new File([wav.toBuffer()], "input.wav", { type: "audio/wav" });

            let prompt;
            // TODO load prompt if it exists

            (async () => {
              try {
                const transcript = await openaiWhisper(file, prompt);
                setWhisperOpenAIOutput(transcript);
              } catch (e: any) {
                console.error('whisper_openai error', e);
                alert.error('whisper_openai error', e.toString());
              }
            })();
            break;
          }
          case 'whispercpp': {
            console.debug('whispercpp attempt');
            const wav = new WaveFile();
            wav.fromScratch(1, 16000, '32f', audio);
            wav.toBitDepth('16');
            const file = new File([wav.toBuffer()], "input.wav", { type: "audio/wav" });

            let prompt;
            // TODO load prompt if it exists

            (async () => {
              try {
                const transcript = await whispercpp(file, prompt);
                setWhisperCppOutput(transcript);
              } catch (e: any) {
                console.error('whispercpp error', e);
                alert.error('whispercpp error', e.toString());
              }
            })();
            break;
          }
        }
      } catch (e: any) {
        console.error('stt_backend error', e);
        alert.error('STT backend error', e.toString());
      }
    },
  });

  if (vad.errored) {
    console.error('vad error', vad.errored);
  }

  function handleTranscriptionResult(preprocessed: string) {
    const cleanText = cleanTranscript(preprocessed);
    const wakeWordEnabled = config("wake_word_enabled") === 'true';
    const textStartsWithWakeWord = wakeWordEnabled && cleanFromPunctuation(cleanText).startsWith(cleanFromPunctuation(config("wake_word")));
    const text = wakeWordEnabled && textStartsWithWakeWord ? cleanFromWakeWord(cleanText, config("wake_word")) : cleanText;

    if (wakeWordEnabled) {
      // Text start with wake word
      if (textStartsWithWakeWord) {
        // Pause amicaLife and update bot's awake status when speaking
        if (config("amica_life_enabled") === "true") {
          amicaLife.pause();
        }
        bot.updateAwake();
      // Case text doesn't start with wake word and not receive trigger message in amica life
      } else {
        if (config("amica_life_enabled") === "true" && amicaLife.triggerMessage !== true && !bot.isAwake()) {
          bot.updateAwake();
        }
      }
    } else {
      // If wake word off, update bot's awake when speaking
      if (config("amica_life_enabled") === "true") {
        amicaLife.pause();
        bot.updateAwake();
      }
    }


    if (text === "") {
      return;
    }


    if (config("autosend_from_mic") === 'true') {
      if (!wakeWordEnabled || bot.isAwake()) {
        bot.receiveMessageFromUser(text,false);
      } 
    } else {
      setUserMessage(text);
    }
    console.timeEnd('performance_transcribe');
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChangeUserMessage(event); 
  
    // Pause amicaLife and update bot's awake status when typing
    if (config("amica_life_enabled") === "true") {
      amicaLife.pause();
      bot.updateAwake();
    }
  }

  // for whisper_browser
  useEffect(() => {
    if (transcriber.output && ! transcriber.isBusy) {
      const output = transcriber.output?.text;
      handleTranscriptionResult(output);
    }
  }, [transcriber]);

  // for whisper_openai
  useEffect(() => {
    if (whisperOpenAIOutput) {
      const output = whisperOpenAIOutput?.text;
      handleTranscriptionResult(output);
    }
  }, [whisperOpenAIOutput]);

  // for whispercpp
  useEffect(() => {
    if (whisperCppOutput) {
      const output = whisperCppOutput?.text;
      handleTranscriptionResult(output);
    }
  }, [whisperCppOutput]);

  function clickedSendButton() {
    bot.receiveMessageFromUser(userMessage,false);
    // only if we are using non-VAD mode should we focus on the input
    if (! vad.listening) {
      if (! hasOnScreenKeyboard()) {
        inputRef.current?.focus();
      }
    }
    setUserMessage("");
  }

  return (
    <div className="fixed bottom-4 z-20 w-full px-4">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4">
          <div className="flex items-center gap-3">
            {/* Mikrofon Butonu */}
            <div className="flex-shrink-0">
              {config("chatbot_backend") === "moshi" ? (
                <button
                  className={`
                    relative w-14 h-14 rounded-full transition-all duration-300
                    ${!moshiMuted 
                      ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50' 
                      : 'bg-gradient-to-br from-secondary to-emerald-500 hover:from-emerald-500 hover:to-secondary shadow-lg shadow-secondary/50'
                    }
                    ${moshiMuted && moshi.getRecorder() != null ? 'animate-pulse-slow' : ''}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    active:scale-95 transform
                  `}
                  disabled={!moshi.getRecorder()}
                  onClick={() => {
                    moshi.toggleMute();
                    setMoshiMuted(!moshiMuted);
                  }}
                >
                  <IconButton
                    iconName={!moshiMuted ? "24/PauseAlt" : "24/Microphone"}
                    className="bg-transparent hover:bg-transparent active:bg-transparent"
                    isProcessing={moshiMuted && moshi.getRecorder() != null}
                    disabled={!moshi.getRecorder()}
                    onClick={() => {}}
                  />
                </button>
              ) : (
                <button
                  className={`
                    relative w-14 h-14 rounded-full transition-all duration-300
                    ${vad.listening 
                      ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50' 
                      : 'bg-gradient-to-br from-secondary to-emerald-500 hover:from-emerald-500 hover:to-secondary shadow-lg shadow-secondary/50'
                    }
                    ${vad.userSpeaking ? 'animate-pulse-slow' : ''}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    active:scale-95 transform
                  `}
                  disabled={config('stt_backend') === 'none' || vad.loading || Boolean(vad.errored)}
                  onClick={vad.toggle}
                >
                  <IconButton
                    iconName={vad.listening ? "24/PauseAlt" : "24/Microphone"}
                    className="bg-transparent hover:bg-transparent active:bg-transparent"
                    isProcessing={vad.userSpeaking}
                    disabled={config('stt_backend') === 'none' || vad.loading || Boolean(vad.errored)}
                    onClick={() => {}}
                  />
                </button>
              )}
            </div>

            {/* Mesaj Input */}
            <div className="flex-1">
              <input
                type="text"
                ref={inputRef}
                placeholder={config("chatbot_backend") === "moshi" ? "Moshi modunda devre dışı..." : "Mesajınızı yazın..."}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (hasOnScreenKeyboard()) {
                      inputRef.current?.blur();
                    }

                    if (userMessage === "") {
                      return false;
                    }

                    clickedSendButton();
                  }
                }}
                disabled={config("chatbot_backend") === "moshi"}
                className="
                  w-full px-5 py-3.5 
                  bg-gray-50 
                  border-2 border-transparent
                  rounded-xl
                  text-gray-900 text-base
                  placeholder:text-gray-400
                  focus:outline-none focus:border-primary focus:bg-white
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  transition-all duration-200
                "
                value={userMessage}
                autoComplete="off"
              />
            </div>

            {/* Gönder Butonu */}
            <div className="flex-shrink-0">
              <button
                className={`
                  relative w-14 h-14 rounded-full transition-all duration-300
                  bg-gradient-to-br from-primary to-blue-600 
                  hover:from-blue-600 hover:to-primary 
                  shadow-lg shadow-primary/50
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                  active:scale-95 transform
                  ${(isChatProcessing || transcriber.isBusy) ? 'animate-pulse-slow' : ''}
                `}
                disabled={isChatProcessing || !userMessage || transcriber.isModelLoading || config("chatbot_backend") === "moshi"}
                onClick={clickedSendButton}
              >
                <IconButton
                  iconName="24/Send"
                  className="bg-transparent hover:bg-transparent active:bg-transparent"
                  isProcessing={isChatProcessing || transcriber.isBusy}
                  disabled={isChatProcessing || !userMessage || transcriber.isModelLoading || config("chatbot_backend") === "moshi"}
                  onClick={() => {}}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
