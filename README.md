# AI Voice Assistant with Azure Speech Services

A premium desktop voice assistant application with beautiful glassmorphism UI, supporting both Azure Speech Services and browser APIs. Features real-time voice recognition, neural text-to-speech, and an intuitive modern interface.

## ✨ Features

### 🎤 Voice Commands
- **"Help"** - List all available commands
- **"What time is it?"** - Get current time
- **"What's the date?"** - Get current date  
- **"Set timer X minutes"** - Set countdown timers with notifications
- **"Tell me a joke"** - Random programming jokes
- **"Calculate X plus Y"** - Simple math operations (plus, minus, times, divide)
- **"Generate password"** - Secure 12-character passwords
- **"Motivate me"** - Inspirational quotes
- **"Flip coin"** - Random heads or tails
- **"Roll dice"** - Random number 1-6

### 🎛️ Voice & Audio Settings
- **Voice Types**: Default (US), British, Australian, Female (LibbyNeural)
- **Speech Speed**: 0.5x to 2x speed control with live preview
- **Volume Control**: 0% to 100% with real-time adjustment
- **Azure/Browser Toggle**: Switch between premium Azure neural voices and browser voices
- **UI-Integrated Settings**: Configure Azure credentials directly in the app

### 🎨 Premium UI Design
- **Glassmorphism Design** with backdrop blur effects and transparency
- **Animated Gradient Backgrounds** with floating animated blobs
- **Compact 3-Panel Layout** (Voice Settings | Main Interface | Command History)
- **Collapsible Command List** - Dropdown to save space
- **Horizontal Audio Controls** - Speed and volume sliders at bottom
- **Smooth Animations** and hover effects throughout
- **Real-time Status Indicators** and visual feedback
- **Desktop App Mode** - Runs as native desktop application with PyWebView

### 📝 Smart Features
- **Command History** - Last 15 conversations with timestamps and command types
- **Real-time Azure Settings** - Update API keys and regions without restart
- **Timer Notifications** - Background timer alerts with voice announcements
- **Graceful Error Handling** - Automatic fallbacks when services unavailable
- **WebSocket Communication** - Real-time bidirectional communication
- **Cross-Platform Support** - Windows desktop application

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

### Desktop App (Recommended)
1. **Launch the app** with `python app.py`
2. **Configure Azure settings** (click ⚙️ button in top-right)
3. **Select voice type** from the left panel
4. **Adjust audio controls** at the bottom (speed/volume)
5. **Click the microphone button** to start listening
6. **Speak your command** clearly
7. **View command history** in the right panel

### Development Mode (Browser)
1. **Start backend**: `cd backend && python main.py`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Open http://localhost:5173** in your browser
4. **Follow steps 2-7 above**

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework with WebSocket support
- **Azure Speech SDK** - Premium neural voice synthesis and recognition
- **Python-dotenv** - Environment variable management
- **Asyncio** - Asynchronous programming for real-time features
- **Python 3.8+**

### Frontend
- **React 18** - Modern UI framework with hooks
- **Vite** - Fast build tool and development server
- **Web Speech API** - Browser speech recognition fallback
- **Speech Synthesis API** - Browser text-to-speech fallback
- **CSS-in-JS** - Styled components with glassmorphism effects

### Desktop Integration
- **PyWebView** - Native desktop window wrapper
- **Threading** - Background server management
- **PyInstaller** - Executable packaging for distribution

## 📱 Browser Support

- **Chrome/Edge**: Full support (recommended) - Complete Web Speech API
- **Firefox**: Limited Web Speech API support - Basic functionality
- **Safari**: Basic support - Reduced features
- **Desktop App**: Full support on Windows - Recommended for best experience

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

## ⚙️ Azure Configuration

### UI-Based Setup (New!)
1. **Click ⚙️ Azure Settings** in top-right corner
2. **Enter your API key** in the text field
3. **Select your region** from dropdown (Japan East, East US, etc.)
4. **Click Save** - credentials are automatically saved to .env file

### Manual Setup
Alternatively, edit `backend/.env` file:
```
KEY=your_azure_speech_key
REGION=your_azure_region
```

## 🔄 Service Toggle

Switch between:
- **🔵 Azure Speech**: Premium neural voices, better accuracy, 6 regions
- **🌐 Browser Speech**: Basic voices, works offline, no setup required

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