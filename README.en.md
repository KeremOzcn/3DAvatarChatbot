# 🤖 AI for Social Goods Club - 3D Avatar Chatbot

> Official 3D virtual assistant project of Istanbul University AI for Social Goods Club

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-green)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

**🌍 Language / Dil:** **English** | [Türkçe](README.md)

---

## 🎬 Demo Video

[![3D Avatar Chatbot Demo](https://img.youtube.com/vi/vTlst4BU0J0/maxresdefault.jpg)](https://youtu.be/vTlst4BU0J0)

> 🎥 **[Click to watch the demo video!](https://youtu.be/vTlst4BU0J0)**

---

## 🎯 Features

- 🤖 **3D Avatar**: Customizable 3D character in VRM format
- 💬 **Multi-language Support**: Turkish and English
- 🎤 **Voice Recognition**: Speech recognition with Whisper.cpp
- 🔊 **Voice Response**: ElevenLabs TTS integration
- 🧠 **AI Backend**: Ollama (Qwen3:8b) and Gemini support
- 🎨 **Modern UI**: Green transparent design with backdrop blur effects

## 🚀 Installation

### Requirements

- Node.js 18.18.0 or higher
- Ollama (for local AI model)
- Whisper.cpp (for speech recognition)

### Steps

1. **Clone the project:**
```bash
git clone https://github.com/KeremOzcn/3DAvatarChatbot.git
cd 3DAvatarChatbot
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env.local
```

4. **Add your API keys:**
Edit `.env.local` file and add required API keys:
- Gemini API Key: https://makersuite.google.com/app/apikey
- ElevenLabs API Key: https://elevenlabs.io/

5. **(Optional) Install Ollama:**
```bash
# Download Ollama from https://ollama.ai
ollama pull qwen3:8b
```

6. **(Optional) Install Whisper.cpp:**
```bash
# https://github.com/ggerganov/whisper.cpp
# Run on port 8081
```

7. **Start development server:**
```bash
npm run dev
```

8. **Open in browser:**
Open `http://localhost:3000` in your browser.

## ⚙️ Configuration

You can configure the following settings in `.env.local`:

### AI Backend
```env
NEXT_PUBLIC_CHATBOT_BACKEND=ollama
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
NEXT_PUBLIC_OLLAMA_MODEL=qwen3:8b
```

### TTS (Text-to-Speech)
```env
NEXT_PUBLIC_TTS_BACKEND=elevenlabs
NEXT_PUBLIC_ELEVENLABS_APIKEY=your_api_key
NEXT_PUBLIC_ELEVENLABS_VOICEID=your_voice_id
```

### STT (Speech-to-Text)
```env
NEXT_PUBLIC_STT_BACKEND=whispercpp
NEXT_PUBLIC_WHISPERCPP_URL=http://localhost:8081
```

### Language
```env
NEXT_PUBLIC_LANGUAGE=en  # or 'tr'
```

## 🎨 Customization

### Change Avatar
1. Put your VRM file in `public/vrm/` folder
2. Add it to `vrmList` array in `src/paths.ts`
3. Select new avatar from settings page

### Add Animation
1. Put your VRMA file in `public/animations/` folder
2. Add it to `animationList` array in `src/paths.ts`

### Change Background
1. Put your image file in `public/bg/` folder
2. Add it to `bgImages` array in `src/paths.ts`

## 📝 System Prompt

You can customize the bot's behavior with the `NEXT_PUBLIC_SYSTEM_PROMPT` variable in `.env.local`.

## 🛠️ Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **3D**: Three.js, @pixiv/three-vrm
- **UI**: Tailwind CSS, Heroicons
- **AI**: Ollama, Gemini
- **TTS**: ElevenLabs
- **STT**: Whisper.cpp
- **i18n**: i18next, react-i18next

## 📦 Build

To create a production build:

```bash
npm run build
npm start
```

## 🤝 Contributing

AI for Social Goods Club members can contribute to the project. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 🙏 Acknowledgments

This project is built upon [Amica](https://github.com/semperai/amica), an open-source 3D avatar framework. We've customized and extended it for educational purposes and community engagement.

**Original Project:**
- **Amica** by [Semper AI](https://github.com/semperai/amica)
- Licensed under MIT License
- We thank the Amica team for their amazing work on the VRM avatar system and AI integration framework

**Our Contributions:**
- Custom UI/UX design with glassmorphism
- Bilingual support (Turkish/English)
- Educational system prompts for club promotion
- Simplified configuration for student use
- Additional documentation and setup guides

For detailed credits, see [CREDITS.md](CREDITS.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Note:** This is a derivative work based on Amica (MIT License). All modifications and additions are also released under MIT License.

## 👥 Contact

- **Club**: AI for Social Goods Club
- **University**: Istanbul University
- **Instagram**: [@aisg_club](https://instagram.com/aisg_club)
- **GitHub**: [KeremOzcn](https://github.com/KeremOzcn)

---

Made with ❤️ by AI for Social Goods Club | Based on [Amica](https://github.com/semperai/amica)
