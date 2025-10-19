#!/usr/bin/env python3
"""Simple Piper TTS HTTP server"""
import io
import wave
from flask import Flask, request, send_file
from flask_cors import CORS
import subprocess
import tempfile
import os
import librosa
import soundfile as sf
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/tts', methods=['GET'])
def tts():
    text = request.args.get('text', '')
    if not text:
        return {'error': 'No text provided'}, 400
    
    # Normalize Turkish characters
    text = text.strip()
    
    try:
        # Create temp file for output
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            tmp_path = tmp.name
        
        # Create temp input file with UTF-8 encoding
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as txt_tmp:
            txt_tmp.write(text)
            txt_path = txt_tmp.name
        
        # Run piper with input file
        # length-scale: 1.0 = normal, <1.0 = faster/higher pitch, >1.0 = slower/lower pitch
        # noise-scale: controls variation (0.667 default)
        result = subprocess.run(
            ['python', '-m', 'piper', 
             '--model', 'models/tr_TR-dfki-medium.onnx',
             '--config', 'models/tr_TR-dfki-medium.onnx.json',
             '-i', txt_path,
             '-f', tmp_path,
             '--length-scale', '0.7',   # Daha tiz/hızlı (tilki sesi)
             '--noise-scale', '0.4'],   # Daha yumuşak ve tatlı
            capture_output=True,
            timeout=30,
            encoding='utf-8'
        )
        
        # Cleanup text file
        try:
            os.unlink(txt_path)
        except:
            pass
        
        if result.returncode != 0:
            return {'error': f'Piper error: {result.stderr.decode()}'}, 500
        
        # Send file directly without pitch shifting
        response = send_file(tmp_path, mimetype='audio/wav')
        
        # Cleanup
        @response.call_on_close
        def cleanup():
            try:
                os.unlink(tmp_path)
            except:
                pass
        
        return response
        
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    print('Starting Piper TTS server on http://localhost:5000')
    app.run(host='0.0.0.0', port=5000, debug=False)
