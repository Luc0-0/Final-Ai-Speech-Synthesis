import { useState, useRef, useCallback, useEffect } from 'react';

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('Ready');
  const [history, setHistory] = useState([]);
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'default',
    speed: 1,
    volume: 1,
    useAzure: false
  });
  const [azureAvailable, setAzureAvailable] = useState(true);
  const recognitionRef = useRef(null);
  const socketRef = useRef(null);

  const speakWithBrowser = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSettings.speed;
      utterance.volume = voiceSettings.volume;
      
      const voices = speechSynthesis.getVoices();
      if (voiceSettings.voice === 'british') {
        utterance.voice = voices.find(v => v.lang === 'en-GB') || voices[0];
      } else if (voiceSettings.voice === 'australian') {
        utterance.voice = voices.find(v => v.lang === 'en-AU') || voices[0];
      } else if (voiceSettings.voice === 'female') {
        utterance.voice = voices.find(v => v.name.toLowerCase().includes('female')) || voices[0];
      }
      
      speechSynthesis.speak(utterance);
    }
  }, [voiceSettings]);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscription(transcript);
        
        if (event.results[0].isFinal) {
          processCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        setStatus('Error: ' + event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize WebSocket
    const connectWebSocket = () => {
      try {
        socketRef.current = new WebSocket('ws://localhost:8000/ws');
        
        socketRef.current.onopen = () => {
          console.log('Connected to server');
          setStatus('Ready');
        };
        
        socketRef.current.onmessage = (event) => {
          const message = JSON.parse(event.data);
          
          if (message.type === 'azure_recognition_result') {
            setTranscription(message.transcript);
            if (message.success) {
              setResponse(message.response.text);
              setStatus(message.response.success ? 'Success' : 'Command not recognized');
              
              const historyItem = {
                command: message.transcript,
                response: message.response.text,
                timestamp: new Date().toLocaleTimeString(),
                commandType: message.response.command_type || 'unknown',
                success: message.response.success,
                source: 'azure'
              };
              setHistory(prev => [historyItem, ...prev].slice(0, 15));
              
              if (voiceSettings.useAzure) {
                speakWithAzure(message.response.text);
              } else {
                speakWithBrowser(message.response.text);
              }
            } else {
              setStatus('Speech not recognized');
            }
          } else if (message.type === 'azure_recognition_error') {
            console.log('Azure recognition error:', message.error);
            setAzureAvailable(false);
            setStatus('Azure unavailable, using browser fallback');
            startBrowserListening();
          } else if (message.type === 'azure_synthesis_complete') {
            console.log('Azure TTS completed');
          } else if (message.type === 'azure_synthesis_error') {
            console.log('Azure TTS error, using browser fallback');
            speakWithBrowser(response);
          } else if (message.type === 'response') {
            setResponse(message.text);
            setStatus(message.success ? 'Success' : 'Command not recognized');
            
            const historyItem = {
              command: transcription,
              response: message.text,
              timestamp: new Date().toLocaleTimeString(),
              commandType: message.command_type || 'unknown',
              success: message.success,
              source: 'browser'
            };
            setHistory(prev => [historyItem, ...prev].slice(0, 15));
            
            speakWithBrowser(message.text);
          } else if (message.type === 'timer_complete') {
            setResponse(message.text);
            setStatus('Timer Complete!');
            speakWithBrowser(message.text);
            
            const historyItem = {
              command: 'Timer notification',
              response: message.text,
              timestamp: new Date().toLocaleTimeString(),
              commandType: 'timer_complete',
              success: true,
              source: 'system'
            };
            setHistory(prev => [historyItem, ...prev].slice(0, 15));
          }
        };
        
        socketRef.current.onerror = () => {
          setStatus('Backend connection failed');
        };
        
        socketRef.current.onclose = () => {
          setStatus('Backend disconnected');
        };
      } catch (error) {
        setStatus('Backend not available');
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const processCommand = useCallback((transcript) => {
    setStatus('Processing...');
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ 
        type: 'process_command', 
        command: transcript 
      }));
    } else {
      setStatus('Backend not connected');
      setResponse('Unable to connect to AI service');
    }
  }, []);

  const startAzureListening = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && azureAvailable) {
      setIsListening(true);
      setStatus('Listening with Azure...');
      setTranscription('');
      setResponse('');
      
      socketRef.current.send(JSON.stringify({ type: 'azure_recognize' }));
    } else {
      startBrowserListening();
    }
  }, [azureAvailable]);

  const startBrowserListening = useCallback(() => {
    if (recognitionRef.current) {
      setIsListening(true);
      setStatus('Listening with browser...');
      setTranscription('');
      setResponse('');
      recognitionRef.current.start();
    }
  }, []);

  const startListening = useCallback(() => {
    if (voiceSettings.useAzure && azureAvailable) {
      startAzureListening();
    } else {
      startBrowserListening();
    }
  }, [voiceSettings.useAzure, azureAvailable, startAzureListening, startBrowserListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setStatus('Ready');
  }, []);

  const updateVoiceSettings = useCallback((newSettings) => {
    setVoiceSettings(newSettings);
  }, []);

  const speakWithAzure = useCallback((text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && azureAvailable) {
      socketRef.current.send(JSON.stringify({
        type: 'azure_synthesize',
        text: text,
        voice_name: getAzureVoiceName()
      }));
    } else {
      speakWithBrowser(text);
    }
  }, [azureAvailable, voiceSettings.voice]);

  const getAzureVoiceName = useCallback(() => {
    switch (voiceSettings.voice) {
      case 'british': return 'en-GB-RyanNeural';
      case 'australian': return 'en-AU-WilliamNeural';
      case 'female': return 'en-US-JennyNeural';
      default: return 'en-US-DavisNeural';
    }
  }, [voiceSettings.voice]);

  const testVoice = useCallback(() => {
    const testText = "This is a test of your voice settings. How does it sound?";
    if (voiceSettings.useAzure && azureAvailable) {
      speakWithAzure(testText);
    } else {
      speakWithBrowser(testText);
    }
  }, [voiceSettings.useAzure, azureAvailable, speakWithAzure, speakWithBrowser]);

  const toggleAzureUsage = useCallback(() => {
    setVoiceSettings(prev => ({ ...prev, useAzure: !prev.useAzure }));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    isListening,
    transcription,
    response,
    status,
    history,
    voiceSettings,
    azureAvailable,
    startListening,
    stopListening,
    updateVoiceSettings,
    testVoice,
    clearHistory,
    toggleAzureUsage
  };
};