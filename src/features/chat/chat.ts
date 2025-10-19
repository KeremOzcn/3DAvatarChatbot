import { Queue } from "typescript-collections";
import { Message, Role, Screenplay, Talk } from "./messages";
import { Viewer } from "@/features/vrmViewer/viewer";
import { Alert } from "@/features/alert/alert";

import { getOllamaChatResponseStream } from "./ollamaChat";

import { elevenlabs } from "@/features/elevenlabs/elevenlabs";

import { AmicaLife } from "@/features/amicaLife/amicaLife";

import { config } from "@/utils/config";
import { cleanTalk } from "@/utils/cleanTalk";
import { processResponse } from "@/utils/processResponse";
import { wait } from "@/utils/wait";

import { isCharacterIdle, characterIdleTime, resetIdleTimer } from "@/utils/isIdle";
import { getGeminiChatResponseStream } from "./geminiChat";

type Speak = {
  audioBuffer: ArrayBuffer | null;
  screenplay: Screenplay;
  streamIdx: number;
};

type TTSJob = {
  screenplay: Screenplay;
  streamIdx: number;
};

export class Chat {
  public initialized: boolean;

  public amicaLife?: AmicaLife;
  public viewer?: Viewer;
  public alert?: Alert;

  public setChatLog?: (messageLog: Message[]) => void;
  public setUserMessage?: (message: string) => void;
  public setAssistantMessage?: (message: string) => void;
  public setShownMessage?: (role: Role) => void;
  public setChatProcessing?: (processing: boolean) => void;
  public setChatSpeaking?: (speaking: boolean) => void;
  public setThoughtMessage?: (message: string) => void;

  // the message from the user that is currently being processed
  // it can be reset
  public stream: ReadableStream<Uint8Array> | null;
  public streams: ReadableStream<Uint8Array>[];
  public reader: ReadableStreamDefaultReader<Uint8Array> | null;
  public readers: ReadableStreamDefaultReader<Uint8Array>[];

  // process these immediately as they come in and add to audioToPlay
  public ttsJobs: Queue<TTSJob>;

  // this should be read as soon as they exist
  // and then deleted from the queue
  public speakJobs: Queue<Speak>;

  private currentAssistantMessage: string;
  private currentUserMessage: string;
  private thoughtMessage: string;

  private lastAwake: number;

  public messageList: Message[];

  public currentStreamIdx: number;

  private eventSource: EventSource | null = null

  constructor() {
    this.initialized = false;

    this.stream = null;
    this.reader = null;
    this.streams = [];
    this.readers = [];

    this.ttsJobs = new Queue<TTSJob>();
    this.speakJobs = new Queue<Speak>();

    this.currentAssistantMessage = "";
    this.currentUserMessage = "";
    this.thoughtMessage = "";

    this.messageList = [];
    this.currentStreamIdx = 0;

    this.lastAwake = 0;
  }

  public initialize(
    amicaLife: AmicaLife,
    viewer: Viewer,
    alert: Alert,
    setChatLog: (messageLog: Message[]) => void,
    setUserMessage: (message: string) => void,
    setAssistantMessage: (message: string) => void,
    setThoughtMessage: (message: string) => void,
    setShownMessage: (role: Role) => void,
    setChatProcessing: (processing: boolean) => void,
    setChatSpeaking: (speaking: boolean) => void,
  ) {
    this.amicaLife = amicaLife;
    this.viewer = viewer;
    this.alert = alert;
    this.setChatLog = setChatLog;
    this.setUserMessage = setUserMessage;
    this.setAssistantMessage = setAssistantMessage;
    this.setShownMessage = setShownMessage;
    this.setThoughtMessage = setThoughtMessage;
    this.setChatProcessing = setChatProcessing;
    this.setChatSpeaking = setChatSpeaking;

    // these will run forever
    this.processTtsJobs();
    this.processSpeakJobs();

    this.updateAwake();
    this.initialized = true;

    this.initSSE();
  }

  public setMessageList(messages: Message[]) {
    this.messageList = messages;
    this.currentAssistantMessage = "";
    this.currentUserMessage = "";
    this.setChatLog!(this.messageList!);
    this.setAssistantMessage!(this.currentAssistantMessage);
    this.setUserMessage!(this.currentAssistantMessage);
    this.currentStreamIdx++;
  }

  public idleTime(): number {
    return characterIdleTime(this.lastAwake);
  }

  public isAwake() {
    return !isCharacterIdle(this.lastAwake);
  }

  public updateAwake() {
    this.lastAwake = new Date().getTime();
    resetIdleTimer();
  }

  public async processTtsJobs() {
    while (true) {
      do {
        const ttsJob = this.ttsJobs.dequeue();
        if (!ttsJob) {
          break;
        }

        if (ttsJob.streamIdx !== this.currentStreamIdx) {
          console.log("skipping tts for streamIdx");
          continue;
        }

        const audioBuffer = await this.fetchAudio(ttsJob.screenplay.talk);
        this.speakJobs.enqueue({
          audioBuffer,
          screenplay: ttsJob.screenplay,
          streamIdx: ttsJob.streamIdx,
        });
      } while (this.ttsJobs.size() > 0);
      await wait(50);
    }
  }

  public async processSpeakJobs() {
    while (true) {
      do {
        const speak = this.speakJobs.dequeue();
        if (!speak) {
          break;
        }
        if (speak.streamIdx !== this.currentStreamIdx) {
          console.log("skipping speak for streamIdx");
          continue;
        }

        if ((window as any).chatvrm_latency_tracker) {
          if ((window as any).chatvrm_latency_tracker.active) {
            const ms =
              +new Date() - (window as any).chatvrm_latency_tracker.start;
            console.log("performance_latency", ms);
            (window as any).chatvrm_latency_tracker.active = false;
          }
        }

        this.bubbleMessage("assistant", speak.screenplay.text);

        if (speak.audioBuffer) {
          this.setChatSpeaking!(true);
          await this.viewer!.model?.speak(speak.audioBuffer, speak.screenplay);
          this.setChatSpeaking!(false);
          this.isAwake() ? this.updateAwake() : null;
        }
      } while (this.speakJobs.size() > 0);
      await wait(50);
    }
  }

  public thoughtBubbleMessage(isThinking: boolean, thought: string) {
    // if not thinking, we should clear the thought bubble 
    if (!isThinking) {
      this.thoughtMessage = "";
      this.setThoughtMessage!("");
      return;
    }

    if (this.thoughtMessage !== "") {
      this.thoughtMessage += " ";
    }
    this.thoughtMessage += thought;
    this.setThoughtMessage!(this.thoughtMessage);
  }

  public bubbleMessage(role: Role, text: string) {
    // TODO: currentUser & Assistant message should be contain the message with emotion in it

    if (role === "user") {
      // add space if there is already a partial message
      if (this.currentUserMessage !== "") {
        this.currentUserMessage += " ";
      }
      this.currentUserMessage += text;
      this.setUserMessage!(this.currentUserMessage);
      this.setAssistantMessage!("");

      if (this.currentAssistantMessage !== "") {
        this.messageList!.push({
          role: "assistant",
          content: this.currentAssistantMessage,
        });

        this.currentAssistantMessage = "";
      }

      this.setChatLog!([
        ...this.messageList!,
        { role: "user", content: this.currentUserMessage },
      ]);
    }

    if (role === "assistant") {
      if (
        this.currentAssistantMessage != "" &&
        !this.isAwake() &&
        config("amica_life_enabled") === "true"
      ) {
        this.messageList!.push({
          role: "assistant",
          content: this.currentAssistantMessage,
        });

        this.currentAssistantMessage = text;
        this.setAssistantMessage!(this.currentAssistantMessage);
      } else {
        this.currentAssistantMessage += text;
        this.setUserMessage!("");
        this.setAssistantMessage!(this.currentAssistantMessage);
      }

      if (this.currentUserMessage !== "") {
        this.messageList!.push({
          role: "user",
          content: this.currentUserMessage,
        });

        this.currentUserMessage = "";
      }

      this.setChatLog!([
        ...this.messageList!,
        { role: "assistant", content: this.currentAssistantMessage },
      ]);
    }

    this.setShownMessage!(role);
  }

  public async interrupt() {
    this.currentStreamIdx++;
    try {
      if (this.reader) {
        console.debug("cancelling");
        if (!this.reader?.closed) {
          await this.reader?.cancel();
        }
        // this.reader = null;
        // this.stream = null;
        console.debug("finished cancelling");
      }
    } catch (e: any) {
      console.error(e.toString());
    }

    // TODO if llm type is llama.cpp, we can send /stop message here
    this.ttsJobs.clear();
    this.speakJobs.clear();
    // TODO stop viewer from speaking
  }

  // this happens either from text or from voice / whisper completion
  public async receiveMessageFromUser(message: string, amicaLife: boolean) {
    if (message === null || message === "") {
      return;
    }

    console.time("performance_interrupting");
    console.debug("interrupting...");
    await this.interrupt();
    console.timeEnd("performance_interrupting");
    await wait(0);
    console.debug("wait complete");

    if (!amicaLife) {
      console.log("receiveMessageFromUser", message);

      this.amicaLife?.receiveMessageFromUser(message);

      if (!/\[.*?\]/.test(message)) {
        message = `[neutral] ${message}`;
      }

      this.updateAwake();
      this.bubbleMessage("user", message);
    }

    // make new stream
    const messages: Message[] = [
      { role: "system", content: config("system_prompt") },
      ...this.messageList!,
      { role: "user", content: amicaLife ? message : this.currentUserMessage },
    ];
    // console.debug('messages', messages);

    await this.makeAndHandleStream(messages);
  }

  public initSSE() {
    // External API disabled
    return;

    /* SSE functionality disabled
    // Close existing SSE connection if it exists
    this.closeSSE();

    this.eventSource = new EventSource('/api/amicaHandler');

    // Listen for incoming messages from the server
    this.eventSource.onmessage = async (event) => {
      try {
        // Parse the incoming JSON message
        const message = JSON.parse(event.data);

        console.log(message);

        // Destructure to get the message type and data
        const { type, data } = message;

        // Handle the message based on its type
        switch (type) {
          case 'normal':
            console.log('Normal message received:', data);
            const messages: Message[] = [
              { role: "system", content: config("system_prompt") },
              ...this.messageList!,
              { role: "user", content: data},
            ];
            let stream = await getEchoChatResponseStream(messages);
            this.streams.push(stream);
            this.handleChatResponseStream();
            break;
          
          case 'animation':
            console.log('Animation data received:', data);
            const animation = await loadVRMAnimation(`/animations/${data}`);
            if (!animation) {
              throw new Error("Loading animation failed");
            }
            this.viewer?.model?.playAnimation(animation,data);
            requestAnimationFrame(() => { this.viewer?.resetCameraLerp(); });
            break;

          case 'playback':
            console.log('Playback flag received:', data);
            this.viewer?.startRecording();
            // Automatically stop recording after 10 seconds
            setTimeout(() => {
              this.viewer?.stopRecording((videoBlob) => {
                // Log video blob to console
                console.log("Video recording finished", videoBlob);

                // Create a download link for the video file
                const url = URL.createObjectURL(videoBlob!);
                const a = document.createElement("a");
                a.href = url;
                a.download = "recording.webm"; // Set the file name for download
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // Revoke the URL to free up memory
                URL.revokeObjectURL(url);
              });
            }, data); // Stop recording after 10 seconds
            break;

          case 'systemPrompt':
            console.log('System Prompt data received:', data);
            updateConfig("system_prompt",data);
            break;

          default:
            console.warn('Unknown message type:', type);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };


    this.eventSource.addEventListener('end', () => {
      console.log('SSE session ended');
      this.eventSource?.close();
    });

    this.eventSource.onerror = (error) => {
      console.error('Error in SSE connection:', error);
      this.eventSource?.close();
      setTimeout(this.initSSE, 500);
    };
    */
  }

  public closeSSE() {
    if (this.eventSource) {
      console.log("Closing existing SSE connection...");
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  public async makeAndHandleStream(messages: Message[]) {
    try {
      this.streams.push(await this.getChatResponseStream(messages));
    } catch (e: any) {
      const errMsg = e.toString();
      console.error(errMsg);
      this.alert?.error("Failed to get chat response", errMsg);
      return errMsg;
    }

    if (this.streams[this.streams.length - 1] == null) {
      const errMsg = "Error: Null stream encountered.";
      console.error(errMsg);
      this.alert?.error("Null stream encountered", errMsg);
      return errMsg;
    }

    return await this.handleChatResponseStream();
  }

  public async handleChatResponseStream() {
    if (this.streams.length === 0) {
      console.log("no stream!");
      return;
    }

    this.currentStreamIdx++;
    const streamIdx = this.currentStreamIdx;
    this.setChatProcessing!(true);

    console.time("chat stream processing");
    let reader = this.streams[this.streams.length - 1].getReader();
    this.readers.push(reader);
    let sentences = new Array<string>();

    let aiTextLog = "";
    let tag = "";
    let isThinking = false;
    let rolePlay = "";
    let receivedMessage = "";

    let firstTokenEncountered = false;
    let firstSentenceEncountered = false;
    console.time("performance_time_to_first_token");
    console.time("performance_time_to_first_sentence");

    try {
      while (true) {
        if (this.currentStreamIdx !== streamIdx) {
          console.log("wrong stream idx");
          break;
        }
        const { done, value } = await reader.read();
        if (!firstTokenEncountered) {
          console.timeEnd("performance_time_to_first_token");
          firstTokenEncountered = true;
        }
        if (done) break;

        receivedMessage += value;
        receivedMessage = receivedMessage.trimStart();

        const proc = processResponse({
          sentences,
          aiTextLog,
          receivedMessage,
          tag,
          isThinking,
          rolePlay,
          callback: (aiTalks: Screenplay[]): boolean => {
            // Generate & play audio for each sentence, display responses
            if (streamIdx !== this.currentStreamIdx) {
              console.log("wrong stream idx");
              return true; // should break
            }

            if (!isThinking) {
              this.ttsJobs.enqueue({
                screenplay: aiTalks[0],
                streamIdx: streamIdx,
              });
            }

            // thought bubble
            this.thoughtBubbleMessage(isThinking, aiTalks[0].text);

            if (!firstSentenceEncountered) {
              console.timeEnd("performance_time_to_first_sentence");
              firstSentenceEncountered = true;
            }

            return false; // normal processing
          },
        });

        sentences = proc.sentences;
        aiTextLog = proc.aiTextLog;
        receivedMessage = proc.receivedMessage;
        tag = proc.tag;
        isThinking = proc.isThinking;
        rolePlay = proc.rolePlay;
        if (proc.shouldBreak) {
          break;
        }
      }
    } catch (e: any) {
      const errMsg = e.toString();
      this.bubbleMessage!("assistant", errMsg);
      console.error(errMsg);
    } finally {
      if (!reader.closed) {
        reader.releaseLock();
      }
      console.timeEnd("chat stream processing");
      if (streamIdx === this.currentStreamIdx) {
        this.setChatProcessing!(false);
      }
    }

    return aiTextLog;
  }

  async fetchAudio(talk: Talk): Promise<ArrayBuffer | null> {
    // TODO we should remove non-speakable characters
    // since this depends on the tts backend, we should do it
    // in their respective functions
    // this is just a simple solution for now
    talk = cleanTalk(talk);
    if (talk.message.trim() === "" || config("tts_muted") === "true") {
      return null;
    }

    try {
      switch (config("tts_backend")) {
        case "none": {
          return null;
        }
        case "elevenlabs": {
          const voiceId = config("elevenlabs_voiceid");
          const voice = await elevenlabs(talk.message, voiceId, talk.style);
          return voice;
        }
      }
    } catch (e: any) {
      console.error(e.toString());
      this.alert?.error("Failed to get TTS response", e.toString());
    }

    return null;
  }

  public async getChatResponseStream(messages: Message[]) {
    console.debug("getChatResponseStream", messages);
    const chatbotBackend = config("chatbot_backend");

    switch (chatbotBackend) {
      case "ollama":
        return getOllamaChatResponseStream(messages);
      case "gemini":
        return getGeminiChatResponseStream(messages);
      default:
        throw new Error(`Unsupported chatbot backend: ${chatbotBackend}`);
    }
  }

}