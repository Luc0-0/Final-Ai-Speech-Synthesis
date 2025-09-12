const ResponseArea = ({ transcription, response, isListening }) => {
  const containerStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const cardBaseStyle = {
    backdropFilter: 'blur(16px)',
    borderRadius: '20px',
    padding: '24px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  };

  const listeningCardStyle = {
    ...cardBaseStyle,
    background: 'rgba(34, 197, 94, 0.12)',
    border: '1px solid rgba(74, 222, 128, 0.25)',
    boxShadow: '0 8px 32px -8px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    animation: 'gentle-pulse 3s ease-in-out infinite'
  };

  const transcriptionCardStyle = {
    ...cardBaseStyle,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px -8px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  };

  const responseCardStyle = {
    ...cardBaseStyle,
    background: 'rgba(59, 130, 246, 0.12)',
    border: '1px solid rgba(96, 165, 250, 0.25)',
    boxShadow: '0 8px 32px -8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const iconStyle = {
    fontSize: '1.25rem',
    marginRight: '12px',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
  };

  const titleStyle = {
    fontSize: '0.95rem',
    fontWeight: '600',
    letterSpacing: '0.01em'
  };

  const contentStyle = {
    fontSize: '1.1rem',
    fontWeight: '500',
    lineHeight: '1.6'
  };

  const pulseIndicatorStyle = {
    width: '12px',
    height: '12px',
    backgroundColor: '#22c55e',
    borderRadius: '50%',
    marginRight: '12px',
    animation: 'pulse-dot 2s ease-in-out infinite',
    boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)'
  };

  const waveVisualizerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
    gap: '3px',
    height: '32px'
  };

  const waveBarStyle = (index) => ({
    width: '3px',
    height: `${8 + Math.random() * 16}px`,
    background: 'linear-gradient(to top, #3b82f6, #8b5cf6)',
    borderRadius: '2px',
    animation: `wave-response 1.2s ease-in-out infinite ${index * 0.1}s`,
    transformOrigin: 'bottom'
  });

  const shimmerOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    animation: 'shimmer-slow 3s ease-in-out infinite'
  };

  return (
    <div style={containerStyle}>
      {isListening && (
        <div style={listeningCardStyle}>
          <div style={shimmerOverlayStyle}></div>
          <div style={headerStyle}>
            <div style={pulseIndicatorStyle}></div>
            <span style={iconStyle}>🎤</span>
            <h3 style={{...titleStyle, color: '#86efac'}}>Listening for your command...</h3>
          </div>
          <p style={{...contentStyle, color: '#bbf7d0'}}>
            Speak clearly: "What time is it?" or try other available commands
          </p>
        </div>
      )}
      
      {transcription && (
        <div style={transcriptionCardStyle}>
          <div style={headerStyle}>
            <span style={iconStyle}>💬</span>
            <h3 style={{...titleStyle, color: 'rgba(255, 255, 255, 0.9)'}}>You said:</h3>
          </div>
          <div style={{
            ...contentStyle,
            color: 'white',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontStyle: 'italic'
          }}>
            "{transcription}"
          </div>
        </div>
      )}
      
      {response && (
        <div style={responseCardStyle}>
          <div style={headerStyle}>
            <span style={iconStyle}>🤖</span>
            <h3 style={{...titleStyle, color: '#93c5fd'}}>AI Response:</h3>
          </div>
          <div style={{
            ...contentStyle,
            color: 'white',
            background: 'rgba(59, 130, 246, 0.15)',
            padding: '20px 24px',
            borderRadius: '12px',
            border: '1px solid rgba(96, 165, 250, 0.2)',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            {response}
          </div>
          
          {/* Sound wave visualization */}
          <div style={waveVisualizerStyle}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={waveBarStyle(i)}></div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.01); opacity: 0.95; }
        }
        
        @keyframes pulse-dot {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        
        @keyframes wave-response {
          0%, 100% { transform: scaleY(0.4); opacity: 0.7; }
          50% { transform: scaleY(1.2); opacity: 1; }
        }
        
        @keyframes shimmer-slow {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ResponseArea;