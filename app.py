import webview
import threading
import uvicorn
import os
import sys
import time
from pathlib import Path

# Handle both development and packaged environments
if getattr(sys, 'frozen', False):
    # Running as packaged executable
    base_path = Path(sys._MEIPASS)
    backend_path = base_path / "backend"
else:
    # Running in development
    base_path = Path(__file__).parent
    backend_path = base_path / "backend"

sys.path.insert(0, str(backend_path))

from backend.main import app

class DesktopApp:
    def __init__(self):
        self.server = None
        self.server_thread = None
        
    def start_server(self):
        """Start FastAPI server in a separate thread"""
        config = uvicorn.Config(app, host="127.0.0.1", port=8000, log_level="error")
        self.server = uvicorn.Server(config)
        self.server_thread = threading.Thread(target=self.server.run, daemon=True)
        self.server_thread.start()
        
        # Wait for server to start
        time.sleep(2)
    
    def stop_server(self):
        """Stop the FastAPI server"""
        if self.server:
            self.server.should_exit = True
    
    def on_window_closed(self):
        """Called when the window is closed"""
        self.stop_server()

def main():
    # Check if frontend dist folder exists
    if getattr(sys, 'frozen', False):
        # Running as packaged executable
        dist_path = Path(sys._MEIPASS) / "frontend" / "dist"
    else:
        # Running in development
        dist_path = Path(__file__).parent / "frontend" / "dist"
    
    if not dist_path.exists():
        print("Frontend dist folder not found!")
        print("Please run 'npm run build' in the frontend directory first.")
        sys.exit(1)
    
    # Initialize the desktop app
    desktop_app = DesktopApp()
    
    # Start the FastAPI server
    desktop_app.start_server()
    
    # Get the path to the built React app
    index_path = dist_path / "index.html"
    
    # Create and start the webview window
    window = webview.create_window(
        title="AI Speech Synthesis",
        url=str(index_path),
        width=1200,
        height=800,
        min_size=(800, 600),
        resizable=True,
        on_top=False
    )
    
    # Set the window closed callback
    window.events.closed += desktop_app.on_window_closed
    
    # Start the webview (this blocks until window is closed)
    webview.start(debug=False)

if __name__ == "__main__":
    main()