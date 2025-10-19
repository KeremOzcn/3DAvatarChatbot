# 🤖 AI for Social Goods Club - Yapay Zeka Asistanı

İstinye Üniversitesi AI for Social Goods Club için geliştirilmiş interaktif 3D yapay zeka asistanı.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Yapılandırma](#yapılandırma)
- [Geliştirme](#geliştirme)
- [Katkıda Bulunma](#katkıda-bulunma)

## ✨ Özellikler

- 🤖 **Yerel AI**: Ollama tabanlı, internet bağlantısı gerektirmeden çalışır
- 🎭 **3D Avatar**: VRM formatında özelleştirilebilir karakterler
- 🗣️ **Türkçe Destek**: Tam Türkçe arayüz ve konuşma
- 🎤 **Sesli Yanıt**: Piper TTS ile doğal Türkçe ses sentezi
- 🎙️ **Sesli Komut**: Whisper ile Türkçe konuşma tanıma (STT)
- 💬 **İnteraktif Sohbet**: Stand ziyaretçileri ile sesli veya yazılı iletişim
- 📚 **Bilgi Bankası**: Kulüp etkinlikleri, projeler ve üyelik bilgileri
- 🎨 **Özelleştirilebilir**: Karakter, arka plan ve animasyonlar

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **AI Backend**: Ollama (qwen3:8b modeli)
- **3D Rendering**: Three.js, @pixiv/three-vrm
- **TTS (Text-to-Speech)**: Piper (Türkçe ses sentezi)
- **STT (Speech-to-Text)**: OpenAI Whisper (Türkçe konuşma tanıma)
- **Styling**: TailwindCSS
- **i18n**: i18next (Türkçe/İngilizce)

## 📦 Kurulum

### Gereksinimler

- Node.js 18.18.0 veya üzeri
- Python 3.8 veya üzeri
- Ollama (yerel AI için)
- FFmpeg (ses işleme için)
- npm veya yarn

### Adım 1: Projeyi Klonlayın

```bash
git clone https://github.com/[KULLANICI_ADI]/aisg-club-assistant.git
cd aisg-club-assistant
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 3: Ollama'yı Kurun ve Başlatın

```bash
# Ollama'yı indirin: https://ollama.ai

# Modeli indirin
ollama pull qwen3:8b

# Ollama servisini başlatın
ollama serve
```

### Adım 4: Paths Dosyasını Oluşturun

```bash
node scripts/generate_paths.js
```

### Adım 5: Python Bağımlılıklarını Kurun

```bash
pip install flask flask-cors openai-whisper piper-tts librosa soundfile
```

### Adım 6: FFmpeg'i Kurun

**Windows:**
```bash
winget install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

### Adım 7: TTS ve STT Sunucularını Başlatın

**Terminal 1 - Piper TTS Sunucusu:**
```bash
python piper_server.py
```

**Terminal 2 - Whisper STT Sunucusu:**
```bash
python whisper_server.py
```

### Adım 8: Geliştirme Sunucusunu Başlatın

**Terminal 3 - Next.js:**
```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açın.

## 🚀 Kullanım

### İlk Kurulum

1. Sayfa açıldığında 3D karakter görünecektir
2. **Yazarak:** Mesaj kutusuna "Merhaba" yazın ve Enter'a basın
3. **Konuşarak:** 🎤 Mikrofon butonuna tıklayın ve Türkçe konuşun
4. Karakter sizi karşılayacak ve kulüp hakkında bilgi verecektir
5. Karakter Türkçe sesli yanıt verecektir

### Örnek Sorular

- "AI for Social Goods Club nedir?"
- "Hangi etkinlikler düzenliyorsunuz?"
- "Nasıl üye olabilirim?"
- "AI Zirveleri hakkında bilgi ver"
- "Workshop'larınız var mı?"

### Ayarlar

Sol üstteki ⚙️ ikonuna tıklayarak:
- Karakter değiştirme
- Arka plan seçimi
- Dil değiştirme (TR/EN)
- Ses ayarları

## ⚙️ Yapılandırma

### .env.local Dosyası

Proje kök dizininde `.env.local` dosyası oluşturun:

```env
# Development
NEXT_PUBLIC_DEVELOPMENT_BASE_URL=http://localhost:3000

# Chatbot Backend
NEXT_PUBLIC_CHATBOT_BACKEND=ollama
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
NEXT_PUBLIC_OLLAMA_MODEL=qwen3:8b

# TTS - Piper (Türkçe)
NEXT_PUBLIC_TTS_BACKEND=piper
NEXT_PUBLIC_PIPER_URL=http://localhost:5000/tts

# STT - Whisper (Türkçe)
NEXT_PUBLIC_STT_BACKEND=whispercpp
NEXT_PUBLIC_WHISPERCPP_URL=http://localhost:8080

# Language
NEXT_PUBLIC_LANGUAGE=tr

# Bot Name
NEXT_PUBLIC_NAME=AI Asistan
```

### Ollama Ayarları

Tarayıcı konsolunda (F12):

```javascript
localStorage.setItem('chatvrm_chatbot_backend', 'ollama');
localStorage.setItem('chatvrm_ollama_url', 'http://localhost:11434');
localStorage.setItem('chatvrm_ollama_model', 'qwen3:8b');
```

### TTS Ayarları

```javascript
localStorage.setItem('chatvrm_tts_backend', 'speecht5');
localStorage.setItem('chatvrm_speecht5_speaker_embedding_url', '/speecht5_speaker_embeddings/cmu_us_slt_arctic-wav-arctic_a0001.bin');
```

### Dil Ayarları

```javascript
localStorage.setItem('chatvrm_language', 'tr'); // Türkçe
```

## 🔧 Geliştirme

### Proje Yapısı

```
amica/
├── public/
│   ├── vrm/              # 3D karakter modelleri
│   ├── bg/               # Arka plan resimleri
│   ├── animations/       # Karakter animasyonları
│   └── speecht5_speaker_embeddings/
├── src/
│   ├── components/       # React bileşenleri
│   ├── features/         # Özellik modülleri
│   ├── i18n/            # Çeviri dosyaları
│   │   └── locales/
│   │       ├── tr/      # Türkçe
│   │       └── en/      # İngilizce
│   └── utils/           # Yardımcı fonksiyonlar
├── scripts/
│   └── generate_paths.js # Path oluşturucu
├── models/              # Piper TTS modelleri
├── piper_server.py      # Piper TTS sunucusu
├── whisper_server.py    # Whisper STT sunucusu
└── .env.local           # Ortam değişkenleri
```

### Yeni Karakter Ekleme

**Not:** VRM dosyaları büyük olduğu için Git LFS kullanmanız veya harici olarak indirmeniz önerilir.

1. VRM dosyasını `/public/vrm/` klasörüne kopyalayın
2. Thumbnail oluşturun: `thumb-[DOSYA_ADI].jpg`
3. Paths'i güncelleyin:
   ```bash
   node scripts/generate_paths.js
   ```

**VRM Modelleri İndir:**
- https://hub.vroid.com/
- https://booth.pm/
- https://3d.nicovideo.jp/

### Yeni Dil Ekleme

1. `/src/i18n/locales/` altında yeni klasör oluşturun
2. `common.json` dosyası ekleyin
3. `/src/i18n/langs.ts` dosyasını güncelleyin

### Build

```bash
# Production build
npm run build

# Build'i çalıştır
npm start
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Mesaj Formatı

- `feat:` Yeni özellik
- `fix:` Hata düzeltme
- `docs:` Dokümantasyon
- `style:` Kod formatı
- `refactor:` Kod iyileştirme
- `test:` Test ekleme
- `chore:` Bakım işleri

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 Ekip

**AI for Social Goods Club**
- İstinye Üniversitesi
- [Website](https://istinye.edu.tr)
- [Instagram](https://instagram.com/aisg_club)

## 🆘 Destek

Sorun yaşıyorsanız:
1. [Issues](https://github.com/[KULLANICI_ADI]/aisg-club-assistant/issues) sayfasını kontrol edin
2. Yeni issue açın
3. [GOREV_DOKUMANI.md](GOREV_DOKUMANI.md) dosyasına bakın

## 🙏 Teşekkürler

- [Amica](https://github.com/semperai/amica) - Temel proje
- [Ollama](https://ollama.ai) - Yerel AI
- [VRM Consortium](https://vrm.dev) - 3D avatar standardı
- İstinye Üniversitesi AI for Social Goods Club

---

**Geliştirme Durumu:** Aktif 🟢
**Son Güncelleme:** Ekim 2025
**Versiyon:** 1.0.0
