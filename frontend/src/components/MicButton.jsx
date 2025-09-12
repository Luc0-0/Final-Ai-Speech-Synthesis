const MicButton = ({ isListening, onStart, onStop }) => {
  const containerStyle = {
    position: 'relative',
    display: 'inline-block'
  };

  const outerRingStyle = {
    position: 'absolute',
    inset: '-12px',
    borderRadius: '50%',
    background: isListening 
      ? 'conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #ef4444)'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))',
    animation: isListening ? 'spin 3s linear infinite' : 'none',
    filter: 'blur(8px)',
    opacity: isListening ? 1 : 0.6
  };

  const buttonStyle = {
    position: 'relative',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    border: 'none',
    background: isListening 
      ? 'linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #ef4444 100%)' 
      : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.125rem',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
    boxShadow: isListening 
      ? '0 20px 40px -8px rgba(220, 38, 38, 0.4), 0 8px 16px -4px rgba(220, 38, 38, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
      : '0 20px 40px -8px rgba(59, 130, 246, 0.4), 0 8px 16px -4px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const pulseRingStyle = {
    position: 'absolute',
    inset: '-8px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    animation: isListening ? 'pulse-ring 2s ease-out infinite' : 'none',
    opacity: isListening ? 1 : 0
  };

  const iconContainerStyle = {
    marginBottom: '8px',
    transform: isListening ? 'scale(1.1)' : 'scale(1)',
    transition: 'transform 0.3s ease'
  };

  const iconStyle = {
    width: '40px',
    height: '40px',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    opacity: 0.9
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = 'scale(1.05)';
    e.target.style.boxShadow = isListening 
      ? '0 25px 50px -8px rgba(220, 38, 38, 0.5), 0 12px 20px -4px rgba(220, 38, 38, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.15)'
      : '0 25px 50px -8px rgba(59, 130, 246, 0.5), 0 12px 20px -4px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.15)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'scale(1)';
    e.target.style.boxShadow = isListening 
      ? '0 20px 40px -8px rgba(220, 38, 38, 0.4), 0 8px 16px -4px rgba(220, 38, 38, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
      : '0 20px 40px -8px rgba(59, 130, 246, 0.4), 0 8px 16px -4px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)';
  };

  const handleMouseDown = (e) => {
    e.target.style.transform = 'scale(0.95)';
  };

  const handleMouseUp = (e) => {
    e.target.style.transform = 'scale(1.05)';
  };

  return (
    <div style={containerStyle}>
      <div style={outerRingStyle}></div>
      <div style={pulseRingStyle}></div>
      
      <button
        style={buttonStyle}
        onClick={isListening ? onStop : onStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div style={iconContainerStyle}>
          {isListening ? (
            <svg style={iconStyle} fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z"/>
            </svg>
          ) : (
            <svg style={iconStyle} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </div>
        <span style={labelStyle}>{isListening ? 'Stop' : 'Speak'}</span>
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MicButton;