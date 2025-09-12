from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import azure.cognitiveservices.speech as speech_sdk
from dotenv import load_dotenv
import os
import json
from datetime import datetime
import asyncio
import random

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure Speech Config
speech_key = os.getenv('KEY')
speech_region = os.getenv('REGION')
speech_config = speech_sdk.SpeechConfig(subscription=speech_key, region=speech_region)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "azure_recognize":
                # Use Azure Speech-to-Text
                try:
                    audio_config = speech_sdk.AudioConfig(use_default_microphone=True)
                    speech_recognizer = speech_sdk.SpeechRecognizer(speech_config, audio_config)
                    
                    result = speech_recognizer.recognize_once()
                    
                    if result.reason == speech_sdk.ResultReason.RecognizedSpeech:
                        command_response = await process_voice_command(result.text)
                        
                        await websocket.send_text(json.dumps({
                            "type": "azure_recognition_result",
                            "transcript": result.text,
                            "response": command_response,
                            "success": True
                        }))
                    else:
                        await websocket.send_text(json.dumps({
                            "type": "azure_recognition_result",
                            "transcript": "",
                            "response": {"text": "Could not understand speech", "success": False, "command_type": "error"},
                            "success": False
                        }))
                except Exception as e:
                    await websocket.send_text(json.dumps({
                        "type": "azure_recognition_error",
                        "error": str(e)
                    }))
            
            elif message["type"] == "azure_synthesize":
                # Use Azure Text-to-Speech
                try:
                    text = message["text"]
                    voice_name = message.get("voice_name", "en-GB-RyanNeural")
                    
                    speech_config.speech_synthesis_voice_name = voice_name
                    synthesizer = speech_sdk.SpeechSynthesizer(speech_config)
                    
                    result = synthesizer.speak_text_async(text).get()
                    
                    if result.reason == speech_sdk.ResultReason.SynthesizingAudioCompleted:
                        await websocket.send_text(json.dumps({
                            "type": "azure_synthesis_complete",
                            "text": text,
                            "success": True
                        }))
                    else:
                        await websocket.send_text(json.dumps({
                            "type": "azure_synthesis_error",
                            "error": "Synthesis failed"
                        }))
                except Exception as e:
                    await websocket.send_text(json.dumps({
                        "type": "azure_synthesis_error",
                        "error": str(e)
                    }))
            
            elif message["type"] == "process_command":
                command = message["command"].lower().strip()
                response = await process_voice_command(command)
                
                await websocket.send_text(json.dumps({
                    "type": "response",
                    "text": response["text"],
                    "success": response["success"],
                    "command_type": response["command_type"]
                }))
            
            elif message["type"] == "start_timer":
                duration = message.get("duration", 60)
                await start_timer(websocket, duration)
                    
    except WebSocketDisconnect:
        pass

async def process_voice_command(command):
    """Process different voice commands and return appropriate responses"""
    
    if "time" in command and "is" in command:
        now = datetime.now()
        return {
            "text": f"The time is {now.hour}:{now.minute:02d}",
            "success": True,
            "command_type": "time"
        }
    
    elif "date" in command:
        now = datetime.now()
        return {
            "text": f"Today is {now.strftime('%A, %B %d, %Y')}",
            "success": True,
            "command_type": "date"
        }
    
    elif "timer" in command or "set timer" in command:
        # Extract duration from command
        words = command.split()
        duration = 60  # default 1 minute
        for i, word in enumerate(words):
            if word.isdigit():
                duration = int(word) * 60  # convert to seconds
                break
        return {
            "text": f"Timer set for {duration//60} minute{'s' if duration//60 != 1 else ''}. I'll notify you when it's done!",
            "success": True,
            "command_type": "timer",
            "duration": duration
        }
    
    elif "joke" in command:
        jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "I told my wife she was drawing her eyebrows too high. She looked surprised!",
            "Why don't programmers like nature? It has too many bugs!",
            "What do you call a fake noodle? An impasta!",
            "Why did the scarecrow win an award? He was outstanding in his field!"
        ]
        return {
            "text": random.choice(jokes),
            "success": True,
            "command_type": "joke"
        }
    
    else:
        return {
            "text": "I didn't understand that command. Try asking for the time, date, setting a timer, or telling a joke!",
            "success": False,
            "command_type": "unknown"
        }

async def start_timer(websocket, duration):
    """Start a timer and notify when complete"""
    await asyncio.sleep(duration)
    await websocket.send_text(json.dumps({
        "type": "timer_complete",
        "text": f"Timer finished! {duration//60} minute{'s' if duration//60 != 1 else ''} is up!",
        "success": True
    }))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)