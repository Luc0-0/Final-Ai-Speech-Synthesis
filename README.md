# AI Voice Assistant with Azure Speech Services

A premium voice assistant application with beautiful glassmorphism UI, supporting both Azure Speech Services and browser APIs.

## ✨ Features

### 🎤 Voice Commands
- **"What time is it?"** - Get current time
- **"What's the date?"** - Get current date  
- **"Set timer X minutes"** - Set countdown timers
- **"Tell me a joke"** - Random jokes

### 🎛️ Voice Settings
- **Voice Types**: Default, British, Australian, Female
- **Speech Speed**: 0.5x to 2x speed control
- **Volume Control**: 0% to 100%
- **Azure/Browser Toggle**: Switch between premium Azure voices and browser voices

### 🎨 Premium UI
- **Glassmorphism Design** with backdrop blur effects
- **Animated Gradient Backgrounds** with floating blobs
- **3-Panel Responsive Layout** (Settings | Main | History)
- **Smooth Animations** and hover effects
- **Real-time Status Indicators**

### 📝 Smart Features
- **Command History** - Last 15 conversations with timestamps
- **Command Type Icons** - Visual indicators for different commands
- **Timer Notifications** - Background timer alerts
- **Error Handling** - Graceful fallbacks

## 🚀 Setup Instructions

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Add your Azure credentials to .env file:
KEY="your_azure_speech_key"
REGION="your_azure_region"

python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Azure Speech Services
1. Create an Azure Speech Service resource
2. Copy your key and region to `backend/.env`
3. Toggle "Azure Speech" in the voice settings panel

### Browser Fallback
- Automatically uses browser Web Speech API if Azure is unavailable
- Works offline with basic browser voices
- No additional setup required

## 🎯 Usage

1. **Start both servers** (backend on :8000, frontend on :5173)
2. **Allow microphone access** when prompted
3. **Click the microphone button** to start listening
4. **Speak your command** clearly
5. **Hear the AI response** through your selected voice service

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Azure Speech SDK** - Premium speech services
- **WebSocket** - Real-time communication
- **Python 3.8+**

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Web Speech API** - Browser speech recognition
- **Speech Synthesis API** - Browser text-to-speech

## 📱 Browser Support

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Limited Web Speech API support
- **Safari**: Basic support

## 🎪 Demo Commands

Try these voice commands:
- "What time is it?"
- "What's the date today?"
- "Set timer 2 minutes"
- "Tell me a joke"

## 🔄 Service Toggle

Switch between:
- **🔵 Azure Speech**: Premium neural voices, better accuracy
- **🌐 Browser Speech**: Basic voices, works offline

## 📄 License

MIT License - Feel free to use and modify!