#!/usr/bin/env python3
"""Simple Whisper STT HTTP server"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile
import os
import sys
import shutil

app = Flask(__name__)
CORS(app)

def ensure_ffmpeg_on_path():
    """Ensure ffmpeg is on PATH (Windows-friendly)."""
    if shutil.which("ffmpeg") is not None:
        return
    # Optional env override
    env_bin = os.environ.get("FFMPEG_BIN", "")
    if env_bin and os.path.exists(os.path.join(env_bin, "ffmpeg.exe")):
        os.environ["PATH"] = env_bin + os.pathsep + os.environ["PATH"]
        print(f"FFmpeg added to PATH from FFMPEG_BIN: {env_bin}")
        return
    # Common install locations (adjust as needed)
    candidates = [
        r"C:\Program Files\FFmpeg\bin",
        r"C:\Program Files (x86)\FFmpeg\bin",
        r"C:\ffmpeg\bin",
    ]
    for p in candidates:
        if os.path.exists(os.path.join(p, "ffmpeg.exe")):
            os.environ["PATH"] = p + os.pathsep + os.environ["PATH"]
            print(f"FFmpeg added to PATH: {p}")
            return

# Add FFmpeg to PATH for Windows (only if not already there)
if sys.platform == "win32":
    ensure_ffmpeg_on_path()

# Load Whisper model (small model for better accuracy with Turkish)
print("Loading Whisper model (small - better for Turkish)...")
model = whisper.load_model("small")
print("Whisper model loaded!")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

@app.route("/inference", methods=["POST"])
def inference():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    uploaded = request.files["file"]
    tmp_path = None

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            uploaded.save(tmp.name)
            tmp_path = tmp.name

        print(f"Transcribing file: {tmp_path}")

        # Transcribe with Turkish language and better settings
        result = model.transcribe(
            tmp_path,
            language="tr",
            fp16=False,
            temperature=0.0,  # more deterministic
            compression_ratio_threshold=2.4,
            logprob_threshold=-1.0,
            no_speech_threshold=0.6,  # higher threshold for silence detection
            condition_on_previous_text=False,
        )

        text = (result.get("text") or "").strip()
        print(f"Transcription result: '{text}'")
        return jsonify({"text": text})

    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        # Cleanup temp file if created
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                pass

if __name__ == "__main__":
    # Make host/port configurable; default to 127.0.0.1:8081 to avoid conflicts/firewall prompts
    host = os.environ.get("WHISPER_HOST", "127.0.0.1")
    port = int(os.environ.get("WHISPER_PORT", "8081"))
    print(f"Starting Whisper STT server on http://{host}:{port}")
    try:
        app.run(host=host, port=port, debug=False, threaded=True)
    except OSError as e:
        # Common Windows error when port is in use or blocked
        print(f"Failed to bind on {host}:{port}: {e}")
        print("Try a different port, e.g.: set WHISPER_PORT=18081 and restart.")
        raise