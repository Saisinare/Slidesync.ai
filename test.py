import os
import azure.cognitiveservices.speech as speechsdk

def synthesize():
    speech_config = speechsdk.SpeechConfig(
        subscription=os.getenv("AZURE_SPEECH_KEY", ""),
        endpoint=os.getenv("AZURE_SPEECH_ENDPOINT", "https://saisinare19-8483-resource.cognitiveservices.azure.com/")
    )
    audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
    
    print("Synthesizing...")
    result = synthesizer.speak_text_async("Hello, this is a test from Azure Text to Speech.").get()
    
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("Success")
    elif result.reason == speechsdk.ResultReason.Canceled:
        print("Canceled:", result.cancellation_details.reason)
        if result.cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details:", result.cancellation_details.error_details)

synthesize()
