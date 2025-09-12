import { useSpeech } from './hooks/useSpeech';
import MicButton from './components/MicButton';
import StatusDisplay from './components/StatusDisplay';
import ResponseArea from './components/ResponseArea';
import VoiceSettings from './components/VoiceSettings';
import CommandHistory from './components/CommandHistory';

function App() {
  const {
    isListening,
    transcription,
    response,
    status,
    startListening,
    stopListening,
    history,
    voiceSettings,
    azureAvailable,
    updateVoiceSettings,
    testVoice,
    clearHistory,
    toggleAzureUsage
  } = useSpeech();

  const appStyle = {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #312e81 25%, #1e3a8a 50%, #1e40af 75%, #1d4ed8 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    color: '#ffffff'
  };

  const backgroundElements = {
    position: 'absolute',
    inset: 0,
    opacity: 0.4,
    pointerEvents: 'none'
  };

  const blob1Style = {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '40%',
    height: '40%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float 20s ease-in-out infinite'
  };

  const blob2Style = {
    position: 'absolute',
    top: '20%',
    right: '-5%',
    width: '35%',
    height: '35%',
    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(35px)',
    animation: 'float 25s ease-in-out infinite reverse'
  };

  const blob3Style = {
    position: 'absolute',
    bottom: '-5%',
    left: '20%',
    width: '30%',
    height: '30%',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(30px)',
    animation: 'float 30s ease-in-out infinite'
  };

  const containerStyle = {
    position: 'relative',
    zIndex: 10,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px'
  };

  const gridStyle = {
    width: '100%',
    maxWidth: '1400px',
    display: 'grid',
    gridTemplateColumns: '320px 1fr 320px',
    gap: '32px',
    alignItems: 'start'
  };

  const mainPanelStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(24px)',
    borderRadius: '32px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden'
  };

  const mainPanelGlow = {
    position: 'absolute',
    inset: '-1px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1), rgba(236, 72, 153, 0.1))',
    borderRadius: '32px',
    zIndex: -1,
    filter: 'blur(1px)'
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
    lineHeight: '1.1'
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1.125rem',
    marginBottom: '48px',
    fontWeight: '400',
    letterSpacing: '0.01em'
  };

  const commandsStyle = {
    marginTop: '40px',
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  };

  const commandsTitle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: '16px',
    fontSize: '1rem',
    letterSpacing: '0.01em'
  };

  const commandsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  };

  const commandItem = {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: '0.875rem',
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    fontWeight: '500'
  };

  return (
    <div style={appStyle}>
      {/* Animated Background */}
      <div style={backgroundElements}>
        <div style={blob1Style}></div>
        <div style={blob2Style}></div>
        <div style={blob3Style}></div>
      </div>

      <div style={containerStyle}>
        <div style={gridStyle}>
          
          {/* Left Panel - Voice Settings */}
          <VoiceSettings 
            settings={voiceSettings}
            azureAvailable={azureAvailable}
            onUpdate={updateVoiceSettings}
            onTestVoice={testVoice}
            onToggleAzure={toggleAzureUsage}
          />

          {/* Center Panel - Main Interface */}
          <div style={mainPanelStyle}>
            <div style={mainPanelGlow}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ marginBottom: '40px' }}>
                <h1 style={titleStyle}>AI Voice Assistant</h1>
                <p style={subtitleStyle}>Speak naturally, get intelligent responses</p>
              </div>

              <StatusDisplay status={status} isListening={isListening} />

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <MicButton 
                  isListening={isListening}
                  onStart={startListening}
                  onStop={stopListening}
                />
              </div>

              <ResponseArea 
                transcription={transcription}
                response={response}
                isListening={isListening}
              />

              {/* Available Commands */}
              <div style={commandsStyle}>
                <h3 style={commandsTitle}>Available Commands</h3>
                <div style={commandsGrid}>
                  <div style={commandItem}>"What time is it?"</div>
                  <div style={commandItem}>"What's the date?"</div>
                  <div style={commandItem}>"Set timer 5 minutes"</div>
                  <div style={commandItem}>"Tell me a joke"</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Command History */}
          <CommandHistory history={history} onClearHistory={clearHistory} />
        </div>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @media (max-width: 1200px) {
          .grid { 
            grid-template-columns: 1fr !important; 
            max-width: 600px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;