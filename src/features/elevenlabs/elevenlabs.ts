import { TalkStyle } from "@/features/chat/messages";
import { config } from '@/utils/config';

export async function elevenlabs(
  message: string,
  voiceId: string,
  style: TalkStyle,
) {
  const apiKey = config("elevenlabs_apikey");
  if (! apiKey) {
    throw new Error("Invalid ElevenLabs API Key");
  }

  // Request body - Jessica için optimize edilmiş tatlı ayarlar
  const body = {
    text: message,
    model_id: config("elevenlabs_model"),
    voice_settings: {
      stability: 0.4,           // Daha canlı ve dinamik
      similarity_boost: 0.85,   // Karaktere daha sadık
      style: 0.3,               // Daha ifadeli ve sevimli
      use_speaker_boost: true
    }
  };

  const elevenlabsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=0&output_format=mp3_44100_128`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
      "xi-api-key": apiKey,
    },
  });
  if (! elevenlabsRes.ok) {
    const errorText = await elevenlabsRes.text();
    console.error("ElevenLabs API Error:", errorText);
    throw new Error(`ElevenLabs API Error (${elevenlabsRes.status}): ${errorText}`);
  }
  const data = await elevenlabsRes.arrayBuffer();

  return data;
}
