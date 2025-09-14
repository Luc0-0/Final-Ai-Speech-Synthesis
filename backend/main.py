from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import azure.cognitiveservices.speech as speech_sdk
from dotenv import load_dotenv
import os
import json
from datetime import datetime
import asyncio
import random

# Load .env from backend directory
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "null"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure Speech Config
speech_key = os.getenv('KEY')
speech_region = os.getenv('REGION')

# Only initialize if credentials are provided
if speech_key and speech_region and speech_key != "your_azure_speech_key":
    speech_config = speech_sdk.SpeechConfig(subscription=speech_key, region=speech_region)
else:
    speech_config = None
    print("Warning: Azure Speech credentials not configured. Azure features will be disabled.")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global speech_key, speech_region, speech_config
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "azure_recognize":
                # Use Azure Speech-to-Text
                if not speech_config:
                    await websocket.send_text(json.dumps({
                        "type": "azure_recognition_error",
                        "error": "Azure Speech not configured"
                    }))
                    continue
                    
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
                    try:
                        await websocket.send_text(json.dumps({
                            "type": "azure_recognition_error",
                            "error": str(e)
                        }))
                    except:
                        pass
            
            elif message["type"] == "azure_synthesize":
                # Use Azure Text-to-Speech
                if not speech_config:
                    await websocket.send_text(json.dumps({
                        "type": "azure_synthesis_error",
                        "error": "Azure Speech not configured"
                    }))
                    continue
                    
                try:
                    text = message["text"]
                    voice_name = message.get("voice_name", "en-GB-RyanNeural")
                    

                    
                    # Create a new speech config for this synthesis
                    synthesis_config = speech_sdk.SpeechConfig(subscription=speech_key, region=speech_region)
                    synthesis_config.speech_synthesis_voice_name = voice_name
                    synthesizer = speech_sdk.SpeechSynthesizer(synthesis_config)
                    
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
                            "error": f"Synthesis failed: {result.reason}",
                            "text": text
                        }))
                except Exception as e:
                    try:
                        await websocket.send_text(json.dumps({
                            "type": "azure_synthesis_error",
                            "error": str(e)
                        }))
                    except:
                        pass
            
            elif message["type"] == "process_command":
                command = message["command"].lower().strip()
                response = await process_voice_command(command)
                
                # If it's a timer command, start the timer
                if response.get("command_type") == "timer" and "duration" in response:
                    asyncio.create_task(start_timer(websocket, response["duration"]))
                
                await websocket.send_text(json.dumps({
                    "type": "response",
                    "text": response["text"],
                    "success": response["success"],
                    "command_type": response["command_type"]
                }))
            
            elif message["type"] == "start_timer":
                duration = message.get("duration", 60)
                await start_timer(websocket, duration)
            
            elif message["type"] == "update_azure_credentials":
                # Update Azure credentials
                new_key = message.get("key", "")
                new_region = message.get("region", "japaneast")
                
                if new_key and new_region:
                    # Update environment variables
                    os.environ['KEY'] = new_key
                    os.environ['REGION'] = new_region
                    
                    # Update global variables
                    speech_key = new_key
                    speech_region = new_region
                    
                    # Reinitialize speech config
                    try:
                        speech_config = speech_sdk.SpeechConfig(subscription=speech_key, region=speech_region)
                        
                        # Update .env file
                        env_content = f"KEY={new_key}\nREGION={new_region}"
                        with open(os.path.join(os.path.dirname(__file__), '.env'), 'w') as f:
                            f.write(env_content)
                        
                        await websocket.send_text(json.dumps({
                            "type": "azure_credentials_updated",
                            "success": True,
                            "message": "Azure credentials updated successfully!"
                        }))
                    except Exception as e:
                        await websocket.send_text(json.dumps({
                            "type": "azure_credentials_error",
                            "success": False,
                            "error": str(e)
                        }))
                else:
                    await websocket.send_text(json.dumps({
                        "type": "azure_credentials_error",
                        "success": False,
                        "error": "Invalid credentials provided"
                    }))
                    
    except WebSocketDisconnect:
        pass

async def process_voice_command(command):
    """Process different voice commands and return appropriate responses"""
    
    if "help" in command or "what can you do" in command or "commands" in command:
        return {
            "text": "I can help you with: Ask for the time, Get today's date, Set timers, Tell jokes, Do math calculations, Generate passwords, Get motivational quotes, Flip coins, Roll dice, or say 'help' anytime!",
            "success": True,
            "command_type": "help"
        }
    
    elif "time" in command and "is" in command:
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
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "I told my computer a joke about UDP. It didn't get it.",
            "Why do programmers prefer dark mode? Because light attracts bugs!"
        ]
        return {
            "text": random.choice(jokes),
            "success": True,
            "command_type": "joke"
        }
    
    elif "calculate" in command or "math" in command or "+" in command or "-" in command:
        try:
            import re
            # Extract numbers and operators
            numbers = re.findall(r'\d+', command)
            if len(numbers) >= 2:
                if "plus" in command or "+" in command:
                    result = int(numbers[0]) + int(numbers[1])
                elif "minus" in command or "-" in command:
                    result = int(numbers[0]) - int(numbers[1])
                elif "times" in command or "multiply" in command:
                    result = int(numbers[0]) * int(numbers[1])
                elif "divide" in command:
                    result = int(numbers[0]) / int(numbers[1])
                else:
                    result = int(numbers[0]) + int(numbers[1])  # default to addition
                return {
                    "text": f"The answer is {result}",
                    "success": True,
                    "command_type": "math"
                }
        except:
            pass
        return {
            "text": "I can do simple math! Try saying 'calculate 25 plus 17' or 'what's 8 times 9'.",
            "success": True,
            "command_type": "math"
        }
    
    elif "password" in command:
        import string
        chars = string.ascii_letters + string.digits + "!@#$%"
        password = ''.join(random.choice(chars) for _ in range(12))
        return {
            "text": f"Here's a secure password: {password}. Make sure to save it somewhere safe!",
            "success": True,
            "command_type": "password"
        }
    
    elif "motivate" in command or "motivation" in command or "inspire" in command:
        quotes = [
            "The only way to do great work is to love what you do.",
            "Innovation distinguishes between a leader and a follower.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "It is during our darkest moments that we must focus to see the light."
        ]
        return {
            "text": random.choice(quotes),
            "success": True,
            "command_type": "motivation"
        }
    
    elif "flip coin" in command or "coin flip" in command:
        result = random.choice(["Heads", "Tails"])
        return {
            "text": f"The coin landed on {result}!",
            "success": True,
            "command_type": "coin"
        }
    
    elif "roll dice" in command or "dice roll" in command:
        result = random.randint(1, 6)
        return {
            "text": f"You rolled a {result}!",
            "success": True,
            "command_type": "dice"
        }
    
    else:
        return {
            "text": "I didn't understand that command. Say 'help' to hear what I can do!",
            "success": False,
            "command_type": "unknown"
        }

async def start_timer(websocket, duration):
    """Start a timer and notify when complete"""
    await asyncio.sleep(duration)
    try:
        await websocket.send_text(json.dumps({
            "type": "timer_complete",
            "text": f"Timer finished! {duration//60} minute{'s' if duration//60 != 1 else ''} is up!",
            "success": True
        }))
    except:
        pass  # WebSocket might be closed

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)