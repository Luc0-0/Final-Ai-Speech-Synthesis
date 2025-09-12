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
- **Desktop App Mode** - Runs as native desktop application with PyWebView

### 📝 Smart Features
- **Command History** - Last 15 conversations with timestamps
- **Command Type Icons** - Visual indicators for different commands
- **Timer Notifications** - Background timer alerts
- **Error Handling** - Graceful fallbacks

## 🚀 Setup Instructions

### Desktop App Setup
```bash
# 1. Install backend dependencies
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 2. Add your Azure credentials to .env file:
KEY="your_azure_speech_key"
REGION="your_azure_region"

# 3. Build the frontend
cd ../frontend
npm install
npm run build

# 4. Run the desktop app
cd ..
python app.py
```

### Development Mode (Browser)
```bash
# Backend
cd backend
python main.py

# Frontend (separate terminal)
cd frontend
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

### Desktop App
1. **Run the desktop app** with `python app.py`
2. **Allow microphone access** when prompted
3. **Click the microphone button** to start listening
4. **Speak your command** clearly
5. **Hear the AI response** through your selected voice service

### Browser Mode
1. **Start both servers** (backend on :8000, frontend on :5173)
2. **Open http://localhost:5173** in your browser
3. **Follow steps 2-5 above**

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

## 🎪 Available Voice Commands

### 🕐 Time & Date
- **"What time is it?"** - Get current time
- **"What's the date?"** - Get today's date
- **"Set timer 5 minutes"** - Set countdown timers

### 🎭 Entertainment
- **"Tell me a joke"** - Random programming jokes
- **"Flip coin"** - Random heads or tails
- **"Roll dice"** - Random number 1-6

### 🧮 Productivity
- **"Calculate 25 plus 17"** - Simple math (plus, minus, times, divide)
- **"Generate password"** - Secure 12-character password

### 💪 Motivation
- **"Motivate me"** - Inspirational quotes
- **"Inspire me"** - Motivational messages

### ❓ Help
- **"Help"** - List all available commands
- **"What can you do?"** - Show capabilities

## 🔄 Service Toggle

Switch between:
- **🔵 Azure Speech**: Premium neural voices, better accuracy
- **🌐 Browser Speech**: Basic voices, works offline

## 📦 Packaging as Executable

To create a standalone desktop executable:

```bash
# 1. Ensure frontend is built
cd frontend
npm run build
cd ..

# 2. Install PyInstaller (if not already installed)
pip install pyinstaller

# 3. Create the executable
pyinstaller app.spec

# 4. Find your executable in dist/AI-Speech-Synthesis.exe
```

**Note**: The executable will be ~200MB due to included dependencies. Make sure to include your `.env` file with Azure credentials in the `backend` folder before packaging.

## 📄 License

MIT License - Feel free to use and modify!