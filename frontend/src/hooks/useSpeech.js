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
  const voiceSettingsRef = useRef(voiceSettings);
  const azureAvailableRef = useRef(azureAvailable);
  
  // Update refs when state changes
  voiceSettingsRef.current = voiceSettings;
  azureAvailableRef.current = azureAvailable;

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
        socketRef.current = new WebSocket('ws://127.0.0.1:8000/ws');
        
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
              
              console.log('Azure recognition result - useAzure:', voiceSettingsRef.current.useAzure, 'voice:', voiceSettingsRef.current.voice);
              
              if (voiceSettingsRef.current.useAzure) {
                // Call Azure synthesis directly
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                  let voiceName;
                  switch (voiceSettingsRef.current.voice) {
                    case 'british': voiceName = 'en-GB-RyanNeural'; break;
                    case 'australian': voiceName = 'en-AU-WilliamNeural'; break;
                    case 'female': voiceName = 'en-GB-LibbyNeural'; break;
                    default: voiceName = 'en-US-DavisNeural';
                  }
                  
                  console.log('Azure recognition - sending synthesis with voice:', voiceName);
                  
                  socketRef.current.send(JSON.stringify({
                    type: 'azure_synthesize',
                    text: message.response.text,
                    voice_name: voiceName
                  }));
                }
              } else {
                // Call browser speech directly
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(message.response.text);
                  utterance.rate = voiceSettingsRef.current.speed;
                  utterance.volume = voiceSettingsRef.current.volume;
                  
                  const voices = speechSynthesis.getVoices();
                  if (voiceSettingsRef.current.voice === 'british') {
                    utterance.voice = voices.find(v => v.lang === 'en-GB') || voices[0];
                  } else if (voiceSettingsRef.current.voice === 'australian') {
                    utterance.voice = voices.find(v => v.lang === 'en-AU') || voices[0];
                  } else if (voiceSettingsRef.current.voice === 'female') {
                    utterance.voice = voices.find(v => v.name.toLowerCase().includes('female')) || voices[0];
                  }
                  
                  speechSynthesis.speak(utterance);
                }
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
            speakWithBrowser(message.text || response);
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
            
            console.log('Response handler - useAzure:', voiceSettingsRef.current.useAzure, 'voice:', voiceSettingsRef.current.voice);
            
            if (voiceSettingsRef.current.useAzure && azureAvailableRef.current) {
              // Call Azure synthesis directly
              if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                let voiceName;
                switch (voiceSettingsRef.current.voice) {
                  case 'british': voiceName = 'en-GB-RyanNeural'; break;
                  case 'australian': voiceName = 'en-AU-WilliamNeural'; break;
                  case 'female': voiceName = 'en-GB-LibbyNeural'; break;
                  default: voiceName = 'en-US-DavisNeural';
                }
                
                console.log('Sending Azure synthesis with voice:', voiceName);
                
                socketRef.current.send(JSON.stringify({
                  type: 'azure_synthesize',
                  text: message.text,
                  voice_name: voiceName
                }));
              }
            } else {
              console.log('Using browser speech');
              // Call browser speech directly
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(message.text);
                utterance.rate = voiceSettingsRef.current.speed;
                utterance.volume = voiceSettingsRef.current.volume;
                
                const voices = speechSynthesis.getVoices();
                if (voiceSettingsRef.current.voice === 'british') {
                  utterance.voice = voices.find(v => v.lang === 'en-GB') || voices[0];
                } else if (voiceSettingsRef.current.voice === 'australian') {
                  utterance.voice = voices.find(v => v.lang === 'en-AU') || voices[0];
                } else if (voiceSettingsRef.current.voice === 'female') {
                  utterance.voice = voices.find(v => v.name.toLowerCase().includes('female')) || voices[0];
                }
                
                speechSynthesis.speak(utterance);
              }
            }
          } else if (message.type === 'timer_complete') {
            setResponse(message.text);
            setStatus('Timer Complete!');
            
            if (voiceSettingsRef.current.useAzure && azureAvailableRef.current) {
              // Call Azure synthesis directly
              if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                let voiceName;
                switch (voiceSettingsRef.current.voice) {
                  case 'british': voiceName = 'en-GB-RyanNeural'; break;
                  case 'australian': voiceName = 'en-AU-WilliamNeural'; break;
                  case 'female': voiceName = 'en-GB-LibbyNeural'; break;
                  default: voiceName = 'en-US-DavisNeural';
                }
                
                socketRef.current.send(JSON.stringify({
                  type: 'azure_synthesize',
                  text: message.text,
                  voice_name: voiceName
                }));
              }
            } else {
              // Call browser speech directly
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(message.text);
                utterance.rate = voiceSettingsRef.current.speed;
                utterance.volume = voiceSettingsRef.current.volume;
                
                const voices = speechSynthesis.getVoices();
                if (voiceSettingsRef.current.voice === 'british') {
                  utterance.voice = voices.find(v => v.lang === 'en-GB') || voices[0];
                } else if (voiceSettingsRef.current.voice === 'australian') {
                  utterance.voice = voices.find(v => v.lang === 'en-AU') || voices[0];
                } else if (voiceSettingsRef.current.voice === 'female') {
                  utterance.voice = voices.find(v => v.name.toLowerCase().includes('female')) || voices[0];
                }
                
                speechSynthesis.speak(utterance);
              }
            }
            
            const historyItem = {
              command: 'Timer notification',
              response: message.text,
              timestamp: new Date().toLocaleTimeString(),
              commandType: 'timer_complete',
              success: true,
              source: 'system'
            };
            setHistory(prev => [historyItem, ...prev].slice(0, 15));
          } else if (message.type === 'azure_credentials_updated') {
            setStatus('Azure credentials updated successfully!');
            setAzureAvailable(true);
          } else if (message.type === 'azure_credentials_error') {
            setStatus(`Azure error: ${message.error}`);
          
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

  const getAzureVoiceName = useCallback(() => {
    switch (voiceSettings.voice) {
      case 'british': return 'en-GB-RyanNeural';
      case 'australian': return 'en-AU-WilliamNeural';
      case 'female': return 'en-GB-LibbyNeural';
      default: return 'en-US-DavisNeural';
    }
  }, [voiceSettings.voice]);

  const speakWithAzure = useCallback((text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && azureAvailableRef.current) {
      // Get current voice name from ref
      let voiceName;
      switch (voiceSettingsRef.current.voice) {
        case 'british': voiceName = 'en-GB-RyanNeural'; break;
        case 'australian': voiceName = 'en-AU-WilliamNeural'; break;
        case 'female': voiceName = 'en-GB-LibbyNeural'; break;
        default: voiceName = 'en-US-DavisNeural';
      }
      
      socketRef.current.send(JSON.stringify({
        type: 'azure_synthesize',
        text: text,
        voice_name: voiceName
      }));
    } else {
      speakWithBrowser(text);
    }
  }, [speakWithBrowser]);

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

  const updateAzureCredentials = useCallback((credentials) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'update_azure_credentials',
        key: credentials.key,
        region: credentials.region
      }));
    }
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
    toggleAzureUsage,
    updateAzureCredentials
  };
};