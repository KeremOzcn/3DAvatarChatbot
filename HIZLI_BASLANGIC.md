# ⚡ Hızlı Başlangıç Rehberi

## 🎯 5 Dakikada Çalıştırın!

### 1️⃣ Gerekli Programları Kurun

```bash
# Node.js yüklü mü kontrol edin
node --version  # 18.18.0 veya üzeri olmalı

# Ollama yüklü mü kontrol edin
ollama --version
```

**Yoksa:**
- Node.js: https://nodejs.org
- Ollama: https://ollama.ai

### 2️⃣ Projeyi Hazırlayın

```bash
# Bağımlılıkları yükleyin
npm install

# Paths dosyasını oluşturun
node scripts/generate_paths.js
```

### 3️⃣ Ollama'yı Başlatın

```bash
# Modeli indirin (ilk seferinde)
ollama pull qwen3:8b

# Ollama servisini başlatın
ollama serve
```

### 4️⃣ Projeyi Çalıştırın

```bash
# Geliştirme sunucusunu başlatın
npm run dev
```

### 5️⃣ Tarayıcıda Açın

http://localhost:3000

---

## 🎨 İlk Yapılandırma

### Tarayıcı Konsolunda (F12)

```javascript
// Ollama ayarları
localStorage.setItem('chatvrm_chatbot_backend', 'ollama');
localStorage.setItem('chatvrm_ollama_url', 'http://localhost:11434');
localStorage.setItem('chatvrm_ollama_model', 'qwen3:8b');

// TTS ayarları
localStorage.setItem('chatvrm_tts_backend', 'speecht5');
localStorage.setItem('chatvrm_speecht5_speaker_embedding_url', '/speecht5_speaker_embeddings/cmu_us_slt_arctic-wav-arctic_a0001.bin');

// Türkçe dil
localStorage.setItem('chatvrm_language', 'tr');

// Sistem prompt'u
localStorage.setItem('chatvrm_system_prompt', `Sen [PROJE_ADI], AI for Social Goods Club'ın yapay zeka asistanısın.

İstinye Üniversitesi:
- İstanbul Sarıyer'de bulunan yenilikçi bir üniversite
- Modern kampüs ve AI laboratuvarları
- Güçlü endüstri bağlantıları

AI for Social Goods Club:
- Yapay zekayı toplumsal fayda için kullanan öğrenci kulübü
- AI Zirveleri, workshop'lar, hackathon'lar düzenliyoruz
- Sağlık, eğitim, çevre, erişilebilirlik alanlarında projeler geliştiriyoruz
- Öğrencilere AI eğitimi, mentorluk ve kariyer fırsatları sunuyoruz

Görevin:
- Kullanıcının sorularına göre bilgi ver, hepsini birden sıralama
- Samimi, kısa ve öz cevaplar ver
- Sadece sorulan konuyla ilgili konuş
- Gerektiğinde detay ver, ama önce kısa başla

Duygularını etiketlerle göster: [neutral], [happy], [excited], [serious], [relaxed], [love]

Türkçe konuş, gençlere hitap eden doğal bir dil kullan.

Örnek:
Kullanıcı: "Merhaba"
Sen: [happy] Merhaba! Ben [PROJE_ADI], AI for Social Goods Club'ın asistanıyım. Size nasıl yardımcı olabilirim? 😊

Kullanıcı: "Kulüp ne yapıyor?"
Sen: [excited] Harika soru! AI Zirveleri, workshop'lar ve hackathon'lar düzenliyoruz. Ayrıca sağlık, eğitim gibi alanlarda sosyal fayda odaklı AI projeleri geliştiriyoruz. Hangi konuda detay istersiniz?`);
```

**Sayfayı yenileyin (F5)**

---

## 🧪 Test Edin

### Örnek Konuşmalar

1. **Merhaba** → Karşılama mesajı
2. **AI for Social Goods Club nedir?** → Kulüp tanıtımı
3. **Hangi etkinlikler var?** → Etkinlik listesi
4. **Nasıl üye olabilirim?** → Üyelik bilgisi

---

## ⚙️ Ayarlar Menüsü

Sol üstteki **🔧** ikonuna tıklayın:

### Görünüm
- **Karakter Modeli**: 5 farklı avatar
- **Arka Plan**: 10 farklı arka plan
- **Animasyon**: Karakter hareketleri

### Chatbot
- **Backend**: Ollama (varsayılan)
- **Model**: qwen3:8b
- **Sistem Prompt**: Kişilik ayarları

### TTS (Ses)
- **Backend**: SpeechT5 (varsayılan)
- **Ses**: Farklı ses modelleri

### Dil
- **Türkçe** (varsayılan)
- English
- Deutsch
- 中文

---

## 🐛 Sorun Giderme

### Karakter Görünmüyor
```bash
node scripts/generate_paths.js
```
Sayfayı yenileyin (F5)

### Ollama Çalışmıyor
```bash
# Servisi başlatın
ollama serve

# Başka terminalde test edin
ollama run qwen3:8b "merhaba"
```

### Ses Gelmiyor
```javascript
// TTS'i kontrol edin
localStorage.getItem('chatvrm_tts_backend')
localStorage.getItem('chatvrm_tts_muted')

// Sessize alınmışsa açın
localStorage.setItem('chatvrm_tts_muted', 'false');
```

### Port Kullanımda
```bash
# Farklı port kullanın
PORT=3001 npm run dev
```

---

## 📱 Mobil/Tablet

Aynı ağdaki cihazlardan erişim:

1. Bilgisayarınızın IP adresini bulun:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Mobil cihazda açın:
   ```
   http://[IP_ADRESI]:3000
   ```

---

## 🚀 Production Build

```bash
# Build oluştur
npm run build

# Çalıştır
npm start
```

---

## 📚 Daha Fazla Bilgi

- [GOREV_DOKUMANI.md](GOREV_DOKUMANI.md) - Detaylı görev listesi
- [README.md](README.md) - Tam dokümantasyon
- [GITHUB_HAZIRLIGI.md](GITHUB_HAZIRLIGI.md) - GitHub gönderim rehberi

---

## ✅ Kontrol Listesi

- [ ] Node.js kurulu (v18.18.0+)
- [ ] Ollama kurulu
- [ ] `npm install` çalıştırıldı
- [ ] `node scripts/generate_paths.js` çalıştırıldı
- [ ] `ollama serve` çalışıyor
- [ ] `npm run dev` çalışıyor
- [ ] http://localhost:3000 açılıyor
- [ ] Karakter görünüyor
- [ ] Konuşma çalışıyor
- [ ] Ses geliyor

**Hepsi ✅ ise hazırsınız! 🎉**

---

**İyi Çalışmalar!** 🚀
AI for Social Goods Club
