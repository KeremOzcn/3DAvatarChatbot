# 🤖 AI for Social Goods Club - 3D Avatar Chatbot

> İstinye Üniversitesi AI for Social Goods Club'ın resmi 3D sanal asistan projesi

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-green)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

**🌍 Language / Dil:** [English](README.en.md) | **Türkçe**

---

## 🎬 Demo Video

[![3D Avatar Chatbot Demo](https://img.youtube.com/vi/vTlst4BU0J0/maxresdefault.jpg)](https://youtu.be/vTlst4BU0J0)

> 🎥 **[Demo videoyu izlemek için tıklayın!](https://youtu.be/vTlst4BU0J0)**

---

## 🎯 Özellikler

- 🤖 **3D Avatar**: VRM formatında özelleştirilebilir 3D karakter
- 💬 **Çoklu Dil Desteği**: Türkçe ve İngilizce
- 🎤 **Ses Tanıma**: Whisper.cpp ile konuşma tanıma
- 🔊 **Sesli Yanıt**: ElevenLabs TTS entegrasyonu
- 🧠 **AI Backend**: Ollama (Qwen3:8b) ve Gemini desteği
- 🎨 **Modern UI**: Yeşil saydam tasarım, backdrop blur efektleri

## 🚀 Kurulum

### Gereksinimler

- Node.js 18.18.0 veya üzeri
- Ollama (yerel AI modeli için)
- Whisper.cpp (ses tanıma için)

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/YOUR_USERNAME/aisg-3d-chatbot.git
cd aisg-3d-chatbot
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment dosyasını oluşturun:**
```bash
cp .env.example .env.local
```

4. **API anahtarlarınızı ekleyin:**
`.env.local` dosyasını düzenleyin ve gerekli API anahtarlarını ekleyin:
- Gemini API Key: https://makersuite.google.com/app/apikey
- ElevenLabs API Key: https://elevenlabs.io/

5. **(Opsiyonel) Ollama'yı kurun:**
```bash
# Ollama'yı https://ollama.ai adresinden indirin
ollama pull qwen3:8b
```

6. **(Opsiyonel) Whisper.cpp'yi kurun:**
```bash
# https://github.com/ggerganov/whisper.cpp
# Port 8081'de çalıştırın
```

7. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

8. **Tarayıcınızda açın:**
Tarayıcınızda `http://localhost:3000` adresini açın.

## ⚙️ Yapılandırma

`.env.local` dosyasında aşağıdaki ayarları yapabilirsiniz:

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

### Dil
```env
NEXT_PUBLIC_LANGUAGE=tr  # veya 'en'
```

## 🎨 Özelleştirme

### Avatar Değiştirme
1. VRM dosyanızı `public/vrm/` klasörüne koyun
2. `src/paths.ts` dosyasında `vrmList` dizisine ekleyin
3. Ayarlar sayfasından yeni avatarı seçin

### Animasyon Ekleme
1. VRMA dosyanızı `public/animations/` klasörüne koyun
2. `src/paths.ts` dosyasında `animationList` dizisine ekleyin

### Arka Plan Değiştirme
1. Görsel dosyanızı `public/bg/` klasörüne koyun
2. `src/paths.ts` dosyasında `bgImages` dizisine ekleyin

## 📝 Sistem Promptu

Bot'un davranışını `.env.local` dosyasındaki `NEXT_PUBLIC_SYSTEM_PROMPT` değişkeni ile özelleştirebilirsiniz.

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **3D**: Three.js, @pixiv/three-vrm
- **UI**: Tailwind CSS, Heroicons
- **AI**: Ollama, Gemini
- **TTS**: ElevenLabs
- **STT**: Whisper.cpp
- **i18n**: i18next, react-i18next

## 📦 Build

Production build oluşturmak için:

```bash
npm run build
npm start
```

## 🤝 Katkıda Bulunma

AI for Social Goods Club üyeleri projeye katkıda bulunabilir.

## � LAcknowledgments

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Note:** This is a derivative work based on Amica (MIT License). All modifications and additions are also released under MIT License.

## 👥 Contact

- **Club**: AI for Social Goods Club
- **University**: Istinye University
- **Instagram**: [@aisg_club](https://instagram.com/aisg_club)
- **GitHub**: [KeremOzcn](https://github.com/KeremOzcn)

---

Made with ❤️ by AI for Social Goods Club | Based on [Amica](https://github.com/semperai/amica)
