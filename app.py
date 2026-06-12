import os
import tempfile
import azure.cognitiveservices.speech as speechsdk
from flask import Flask, request, send_file, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tts_history.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class SynthesisHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    voice = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'voice': self.voice,
            'created_at': self.created_at.isoformat()
        }

with app.app_context():
    db.create_all()

SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY", "")
SPEECH_ENDPOINT = os.getenv("AZURE_SPEECH_ENDPOINT", "https://saisinare19-8483-resource.cognitiveservices.azure.com/")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/synthesize", methods=["POST"])
def synthesize():
    data = request.json
    text = data.get("text")
    voice = data.get("voice", "en-US-Aria:DragonHDOmniLatestNeural")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        speech_config = speechsdk.SpeechConfig(
            subscription=SPEECH_KEY, 
            endpoint=SPEECH_ENDPOINT
        )
        speech_config.speech_synthesis_voice_name = voice

        # Save to temp file
        _, temp_path = tempfile.mkstemp(suffix=".wav")
        audio_config = speechsdk.audio.AudioOutputConfig(filename=temp_path)

        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
        result = speech_synthesizer.speak_text_async(text).get()

        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            # Log to database
            new_history = SynthesisHistory(text=text, voice=voice)
            db.session.add(new_history)
            db.session.commit()
            
            return send_file(temp_path, mimetype="audio/wav")
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = result.cancellation_details
            return jsonify({"error": f"Speech synthesis canceled: {cancellation_details.reason}"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/history", methods=["GET"])
def get_history():
    history = SynthesisHistory.query.order_by(SynthesisHistory.created_at.desc()).all()
    return jsonify([item.to_dict() for item in history])

if __name__ == "__main__":
    app.run(debug=True, port=5000)
