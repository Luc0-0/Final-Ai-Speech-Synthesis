const StatusDisplay = ({ status, isListening }) => {
  const getStatusConfig = () => {
    if (isListening) return {
      color: '#60a5fa',
      bgColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(96, 165, 250, 0.3)',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      icon: '🎤'
    };
    if (status.includes('Error')) return {
      color: '#f87171',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(248, 113, 113, 0.3)',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      icon: '⚠️'
    };
    if (status === 'Success') return {
      color: '#4ade80',
      bgColor: 'rgba(34, 197, 94, 0.15)',
      borderColor: 'rgba(74, 222, 128, 0.3)',
      glowColor: 'rgba(34, 197, 94, 0.4)',
      icon: '✅'
    };
    if (status === 'Processing...') return {
      color: '#facc15',
      bgColor: 'rgba(234, 179, 8, 0.15)',
      borderColor: 'rgba(250, 204, 21, 0.3)',
      glowColor: 'rgba(234, 179, 8, 0.4)',
      icon: '⚡'
    };
    return {
      color: 'rgba(255, 255, 255, 0.9)',
      bgColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      glowColor: 'rgba(255, 255, 255, 0.2)',
      icon: '🤖'
    };
  };

  const config = getStatusConfig();

  const containerStyle = {
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const statusBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '16px 32px',
    borderRadius: '20px',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${config.borderColor}`,
    background: config.bgColor,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 8px 32px -8px ${config.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
    position: 'relative',
    overflow: 'hidden'
  };

  const iconStyle = {
    fontSize: '1.5rem',
    marginRight: '16px',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
  };

  const textStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: config.color,
    letterSpacing: '0.01em'
  };

  const waveContainerStyle = {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    height: '40px'
  };

  const waveBarStyle = (delay, height) => ({
    width: '4px',
    height: `${height}px`,
    background: 'linear-gradient(to top, #3b82f6, #8b5cf6, #ec4899)',
    borderRadius: '2px',
    animation: `wave 1.5s ease-in-out infinite ${delay}s`,
    transformOrigin: 'bottom'
  });

  const shimmerStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    animation: isListening ? 'shimmer 2s ease-in-out infinite' : 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={statusBadgeStyle}>
        <div style={shimmerStyle}></div>
        <span style={iconStyle}>{config.icon}</span>
        <span style={textStyle}>{status}</span>
      </div>
      
      {isListening && (
        <div style={waveContainerStyle}>
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              style={waveBarStyle(i * 0.1, 12 + Math.sin(i) * 8)}
            ></div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); opacity: 0.7; }
          50% { transform: scaleY(1.5); opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default StatusDisplay;