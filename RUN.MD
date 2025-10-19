# =========================
# AISG 3D Asistan - Windows (PowerShell) Hızlı Kurulum ve Çalıştırma
# =========================

# 0) Proje yolu (gerektiğinde değiştirin)
$PROJ = "c:\Users\LENOVO\Desktop\Aktif Projeler\clubBot-main"

# 1) Projeye girin ve Node bağımlılıklarını kurun
cd "$PROJ"
node -v
npm install

# 2) FFmpeg kurun (Whisper için gerekli) - PATH’e eklenmesi için yeni terminal açmanız gerekebilir
winget install ffmpeg

# 3) Python sanal ortam oluşturun ve etkinleştirin
python -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1

# 4) pip/setuptools/wheel yükseltme (Erişim hatası yaşamamak için "python -m pip" kullanıyoruz)
python -m pip install --upgrade pip setuptools wheel
# Eğer pip yükseltmede sorun olursa (Erişim engellendi):
# python -m ensurepip --upgrade

# 5) Whisper + Flask bağımlılıklarını kurun (Piper GEREK YOK; ElevenLabs kullanıyoruz)
python -m pip install flask==3.0.3 flask-cors==4.0.0 openai-whisper==20231117 tiktoken==0.7.0

# 6) Torch (CPU) kurun (sanal ortama)
python -m pip install --index-url https://download.pytorch.org/whl/cpu torch==2.6.0 torchaudio==2.6.0

# 7) .env.local dosyanızı (gerekirse) kontrol/ düzenlemek için açın (API key ve ayarlar burada)
# Önemli: Gerçek ElevenLabs API anahtarınızı commit ETMEYİN; sızdıysa panelden döndürün.
# notepad .\.env.local

# 8) Whisper STT sunucusunu ayrı bir PowerShell penceresinde başlatın (8080)
Start-Process powershell -NoExit -Command "cd `"$PROJ`"; .\.venv\Scripts\Activate.ps1; python whisper_server.py"

# 9) Ollama: Modeli indirin ve servisin çalıştığını test edin
ollama pull qwen3:8b
ollama list
ollama run qwen3:8b "merhaba"

# Not: Windows’ta Ollama çoğunlukla servis olarak zaten çalışır.
# "Error: listen tcp 127.0.0.1:11434: bind..." görürseniz servis zaten listening, "ollama serve" demeyin.
# Port 11434’i hangi süreç kullanıyor görmek isterseniz:
# netstat -ano | findstr :11434
# taskkill /PID <PID> /F

# (Opsiyonel) Ollama’yı farklı portta koşmak isterseniz:
# $env:OLLAMA_HOST = "127.0.0.1:11435"
# ollama serve
# Sonrasında .env.local içindeki NEXT_PUBLIC_OLLAMA_URL=içinde portu 11435 yapmayı unutmayın.

# 10) Next.js geliştirme sunucusunu ayrı bir PowerShell penceresinde başlatın
Start-Process powershell -NoExit -Command "cd `"$PROJ`"; npm run dev"

# 11) Tarayıcıdan açın
# http://localhost:3000

# 12) Tarayıcı ayarlarını sabitleme (localStorage) - Bu satırlar PowerShell’de çalışmaz;
# tarayıcı konsolunda (F12 > Console) tek tek yapıştırın:
Write-Host ""
Write-Host "Tarayıcı konsolunda (F12 > Console) şu satırları çalıştırın:" -ForegroundColor Yellow
Write-Host "localStorage.setItem('chatvrm_tts_backend','elevenlabs');"
Write-Host "localStorage.setItem('chatvrm_language','tr');"
Write-Host "localStorage.setItem('chatvrm_chatbot_backend','ollama');"
Write-Host "localStorage.setItem('chatvrm_tts_muted','false');"
Write-Host "Sayfayı yenileyin (F5)."
Write-Host ""

# 13) Hızlı test
# - Mikrofonla konuşun → Whisper (8080) yazıya çevirir.
# - Asistan cevap verince ses ElevenLabs’tan gelir (tarayıcı üzerinden).
# - Ses yoksa tarayıcı konsolunda:
#   localStorage.getItem('chatvrm_tts_backend')  # elevenlabs olmalı
#   localStorage.setItem('chatvrm_tts_muted','false');

# 14) Sık karşılaşılan sorunlar - Pratik çözümler
# - pip upgrade "Access is denied": Diğer terminalleri kapatın; "python -m pip ..." kullanın; son çare "python -m ensurepip --upgrade".
# - "No module named flask": Kurulumları sanal ortam (.\.venv\Scripts\Activate.ps1) içinde yaptığınızdan emin olun.
# - piper-tts / piper-phonemize hatası: Piper kullanmıyoruz; ElevenLabs TTS var → bu hatayı yok sayın.
# - Ollama port meşgul: Servis zaten çalışıyordur; "ollama serve" kullanmayın. Gerekirse "netstat -ano | findstr :11434" + "taskkill /PID <PID> /F".
# - FFmpeg bulunamadı: winget kurulumundan sonra yeni terminal açın (PATH tazelensin) veya sistemi yeniden başlatın.

# 15) Production (opsiyonel)
# npm run build
# npm start
# http://localhost:3000

## ⚠️ Çalıştırmayı Zorlaştıran ve Kaçınılması Gereken Faktörler

Aşağıdaki maddeler tipik takılma noktaları ve pratik çözümlerle birlikte listelenmiştir. Bu hatalara düşmemek kurulum ve çalıştırmayı ciddi şekilde hızlandırır.

- Sanal ortam (venv) kullanmamak
  - Sorun: `No module named flask`, yanlış Python’a kurulum, karışık paket sürümleri.
  - Kaçın: Her Python komutundan önce `.venv`’i aktif et.
    - Etkinleştirme: `.\.venv\Scripts\Activate.ps1`
    - Kurulumlar: `python -m pip install ...` (venv içinde)
  - İpucu: Prompt başında `(.venv)` ibaresi görünmeli.

- FFmpeg’in kurulu olmaması / PATH’e eklenmemesi
  - Sorun: Whisper ilk dönüştürmede patlar.
  - Çözüm: `winget install ffmpeg` sonrası yeni terminal aç; gerekirse sistemi yeniden başlat.
  - Alternatif: FFmpeg bin klasörünü PATH’e manuel ekle.

- pip yükseltme sırasında erişim hatası
  - Belirti: `[WinError 5] Access is denied` veya `pip.exe` kaldırılamıyor.
  - Kaçın: `python -m pip install --upgrade pip setuptools wheel` kullan.
  - Gerekirse: Tüm terminalleri kapat, Yönetici PowerShell aç, son çare `python -m ensurepip --upgrade`.

- Piper bağımlılıklarını kurmaya çalışmak
  - Sorun: Windows/Python 3.10 ortamında `piper-phonemize` bulunamıyor vb.
  - Kaçın: Bu projede TTS olarak ElevenLabs kullanıyoruz; Piper kurma/çalıştırmaya gerek yok.
  - Not: `requirements.txt` içindekileri toptan kurma; sadece Whisper + Flask paketlerini kur.

- Port çakışmaları (11434, 8080, 3000)
  - Sorun: `bind` hataları, servis zaten çalışırken ikinci kez başlatma.
  - Kaçın:
    - Ollama: Windows’ta servis genelde zaten çalışır. “ollama serve” deme; sadece `ollama run qwen3:8b "merhaba"` ile test et.
    - Port meşgulse PID bul: `netstat -ano | findstr :11434` → `taskkill /PID <PID> /F`.
    - Farklı port kullanacaksan `.env.local` değerini de güncelle ve `npm run dev`’i yeniden başlat.
  - STT: 8080’i başka süreç kullanıyorsa `whisper_server.py`’yi kapat/aç veya farklı portla çalıştırıp `.env.local`’ı eşitle.

- Tarayıcı localStorage’ın .env ayarlarını “ezmesi”
  - Sorun: .env’de ElevenLabs seçili ama tarayıcıda eski TTS ayarı kalmış.
  - Kaçın/Çözüm (Konsol F12):
    - `localStorage.setItem('chatvrm_tts_backend','elevenlabs');`
    - `localStorage.setItem('chatvrm_language','tr');`
    - `localStorage.setItem('chatvrm_chatbot_backend','ollama');`
    - `localStorage.setItem('chatvrm_tts_muted','false');`
  - Gerekirse ilgili anahtarları `removeItem` ile silip sayfayı yenile.

- Yanlış ElevenLabs bilgileri (API key, Voice ID, Model)
  - Sorun: 401/403, ses gelmiyor, hatalı model/voice.
  - Kaçın: `.env.local` içine doğru `NEXT_PUBLIC_ELEVENLABS_APIKEY`, `VOICEID`, `MODEL` yaz.
  - Güvenlik: API anahtarlarını asla commit etme. Sızdıysa panelden döndür.
  - Kota/plan: Ücretsiz planda kota dolabilir; panelden kullanımını kontrol et.

- Node sürüm uyumsuzluğu / PATH karmaşası
  - Sorun: Next.js derleme hataları, worker bundle sorunları.
  - Kaçın: Node 18.18+ (öneri 20.x). `node -v` ile kontrol et.
  - NVM-windows kullanıyorsan doğru sürümü aktif et ve PATH sırasını kontrol et.

- Aynı terminalde hem Whisper hem Next.js’i yürütmek
  - Sorun: Sanal ortam/komutlar karışır, süreçleri yönetmek zorlaşır.
  - Kaçın: Ayrı PowerShell pencerelerinde çalıştır:
    - Pencere 1: Whisper (venv aktif)
    - Pencere 2: `npm run dev`
    - (Opsiyonel) Pencere 3: Ollama test/komutları

- Windows Güvenlik Duvarı/Antivirüs müdahalesi
  - Sorun: 8080/11434 bağlantıları engellenebilir, ilk çalıştırmada izin pencereleri gelir.
  - Kaçın: İlk uyarıda izin ver. Ağ politikaları varsa localhost trafiğini whitelist’e al.
  - Antivirüs bazı dosyaları kilitleyebiliyor (örn. `node_modules` değişikliklerinde). Proje klasörünü hariçlere eklemek gerekebilir.

- Yollar ve tırnak işaretleri (boşluk içeren klasör adları)
  - Sorun: PowerShell’de boşluk içeren yollar yanlış ayrışır.
  - Kaçın: Tüm yol argümanlarını çift tırnakla yaz: `cd "c:\Users\LENOVO\Desktop\Aktif Projeler\clubBot-main"`.
  - `Start-Process` içinde kaçış karakteri olarak PowerShell backtick (`) doğru yapıştırıldığından emin ol.

- Whisper’ın ilk yüklemede yavaş görünmesi
  - Sorun: İlk model indirmesi/derlemesi uzun sürebilir; “takıldı” sanılır.
  - Kaçın: İlk istek biraz uzun sürebilir; terminal çıktısını takip et. FFmpeg ve Torch CPU kurulu olduğundan emin ol.

- CUDA/GPUsuz sistemde yanlış Torch kurulumu
  - Sorun: CUDA hataları, import sorunları.
  - Kaçın: CPU tekerlerini kurduk (resmi index-url ile). CUDA kurma.

- HTTPS/mixed content problemleri (geliştirmede)
  - Sorun: Site HTTPS, servis HTTP ise tarayıcı bloklar.
  - Kaçın: Geliştirmede tamamını HTTP kullan (localhost); HTTPS’e geçersen tüm servisleri HTTPS’e uygunlaştır.

- Ollama model/depoyu çekememe (kurumsal network/proxy)
  - Sorun: `ollama pull` başarısız.
  - Kaçın: Proxy ayarlarını sistem genelinde tanımla veya ev ağı kullan. Gerekirse VPN kapatıp tekrar dene.

- Üst üste çalıştırma/çakışan watcher’lar
  - Sorun: Birden fazla `npm run dev` açık olursa port/FS watcher sorunları.
  - Kaçın: Tek bir dev sunucusu açık tut. Port meşgulse yeni portla başlat: `set PORT=3001; npm run dev` (PowerShell’de `;` ayırıcı).

- Tarayıcı otomatik oynatma (autoplay) kısıtları
  - Sorun: İlk ses çalınmayabilir; kullanıcı etkileşimi gerekir.
  - Kaçın: Sayfada bir kez tıkla/etkileşim kur; sessiz modda olmadığından emin ol.

- CORS/URL uyuşmazlığı
  - Sorun: STT URL değişti ama `.env.local` aynı kaldı.
  - Kaçın: Port/URL değişikliği yaptıysan `.env.local`’ı güncelle; Next.js’i yeniden başlat.

Bu maddelere dikkat edersen kurulum/çalıştırma sorunsuz ve hızlı ilerler.