const VoiceSettings = ({ settings, azureAvailable, onUpdate, onTestVoice, onToggleAzure }) => {
  const voices = [
    { id: 'default', name: 'Default', flag: '🇺🇸', accent: 'American' },
    { id: 'british', name: 'British', flag: '🇬🇧', accent: 'UK English' },
    { id: 'australian', name: 'Australian', flag: '🇦🇺', accent: 'Australian' },
    { id: 'female', name: 'Female', flag: '👩', accent: 'Feminine' },
  ];

  const panelStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(24px)',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    padding: '32px 28px',
    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    height: 'fit-content'
  };

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '-0.01em'
  };

  const sectionStyle = {
    marginBottom: '32px'
  };

  const labelStyle = {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '16px',
    letterSpacing: '0.01em'
  };

  const voiceButtonStyle = (isSelected) => ({
    width: '100%',
    padding: '16px 20px',
    borderRadius: '16px',
    border: `1px solid ${isSelected ? 'rgba(96, 165, 250, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
    background: isSelected 
      ? 'rgba(59, 130, 246, 0.2)' 
      : 'rgba(255, 255, 255, 0.04)',
    color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    backdropFilter: 'blur(8px)',
    boxShadow: isSelected 
      ? '0 8px 32px -8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
      : '0 4px 16px -4px rgba(0, 0, 0, 0.1)'
  });

  const voiceInfoStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  const voiceDetailsStyle = {
    marginLeft: '16px'
  };

  const voiceNameStyle = {
    fontWeight: '600',
    fontSize: '1rem',
    marginBottom: '2px'
  };

  const voiceAccentStyle = {
    fontSize: '0.8rem',
    opacity: 0.7
  };

  const sliderContainerStyle = {
    position: 'relative'
  };

  const sliderStyle = {
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backdropFilter: 'blur(8px)'
  };

  const sliderValueStyle = {
    position: 'absolute',
    right: 0,
    top: '-8px',
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600'
  };

  const testButtonStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
    color: 'white',
    fontWeight: '700',
    padding: '16px 20px',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
    fontSize: '1rem',
    letterSpacing: '0.02em',
    boxShadow: '0 8px 32px -8px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)'
  };

  const handleVoiceHover = (e, isSelected) => {
    if (!isSelected) {
      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }
  };

  const handleVoiceLeave = (e, isSelected) => {
    if (!isSelected) {
      e.target.style.background = 'rgba(255, 255, 255, 0.04)';
      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
  };

  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>
        <span style={{ marginRight: '16px', fontSize: '1.5rem' }}>🎛️</span>
        Voice Settings
      </h2>

      {/* Voice Selection */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Voice Type</label>
        <div>
          {voices.map((voice) => {
            const isSelected = settings?.voice === voice.id;
            return (
              <button
                key={voice.id}
                onClick={() => onUpdate({ ...settings, voice: voice.id })}
                style={voiceButtonStyle(isSelected)}
                onMouseEnter={(e) => handleVoiceHover(e, isSelected)}
                onMouseLeave={(e) => handleVoiceLeave(e, isSelected)}
              >
                <div style={voiceInfoStyle}>
                  <span style={{ fontSize: '1.5rem' }}>{voice.flag}</span>
                  <div style={voiceDetailsStyle}>
                    <div style={voiceNameStyle}>{voice.name}</div>
                    <div style={voiceAccentStyle}>{voice.accent}</div>
                  </div>
                </div>
                {isSelected && (
                  <span style={{ fontSize: '1.2rem', color: '#60a5fa' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Speed Control */}
      <div style={sectionStyle}>
        <div style={sliderContainerStyle}>
          <label style={labelStyle}>Speech Speed</label>
          <div style={sliderValueStyle}>{settings?.speed || 1}x</div>
        </div>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={settings?.speed || 1}
          onChange={(e) => onUpdate({ ...settings, speed: parseFloat(e.target.value) })}
          style={sliderStyle}
        />
      </div>

      {/* Volume Control */}
      <div style={sectionStyle}>
        <div style={sliderContainerStyle}>
          <label style={labelStyle}>Volume</label>
          <div style={sliderValueStyle}>{Math.round((settings?.volume || 1) * 100)}%</div>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings?.volume || 1}
          onChange={(e) => onUpdate({ ...settings, volume: parseFloat(e.target.value) })}
          style={sliderStyle}
        />
      </div>

      {/* Azure Toggle */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Speech Service</label>
        <button
          onClick={onToggleAzure}
          style={{
            ...voiceButtonStyle(settings?.useAzure),
            justifyContent: 'space-between'
          }}
        >
          <div style={voiceInfoStyle}>
            <span style={{ fontSize: '1.5rem', marginRight: '16px' }}>
              {settings?.useAzure ? '🔵' : '🌐'}
            </span>
            <div style={voiceDetailsStyle}>
              <div style={voiceNameStyle}>
                {settings?.useAzure ? 'Azure Speech' : 'Browser Speech'}
              </div>
              <div style={voiceAccentStyle}>
                {settings?.useAzure ? 'Premium Neural Voices' : 'Basic Browser Voices'}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: azureAvailable ? '#4ade80' : '#f87171' }}>
            {azureAvailable ? '✓ Available' : '✗ Unavailable'}
          </div>
        </button>
      </div>

      {/* Test Voice Button */}
      <button 
        style={testButtonStyle}
        onClick={onTestVoice}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.02)';
          e.target.style.boxShadow = '0 12px 40px -8px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 32px -8px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
        }}
        onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
        onMouseUp={(e) => e.target.style.transform = 'scale(1.02)'}
      >
        🔊 Test Voice Settings
      </button>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default VoiceSettings;