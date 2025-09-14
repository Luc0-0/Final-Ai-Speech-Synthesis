const AudioControls = ({ settings, onUpdate }) => {
  const controlsStyle = {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '20px',
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const controlGroupStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle = {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const sliderStyle = {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none'
  };

  const valueStyle = {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600'
  };

  return (
    <div style={controlsStyle}>
      {/* Speed Control */}
      <div style={controlGroupStyle}>
        <div style={labelStyle}>
          <span>🚀 Speed</span>
          <span style={valueStyle}>{settings?.speed || 1}x</span>
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
      <div style={controlGroupStyle}>
        <div style={labelStyle}>
          <span>🔊 Volume</span>
          <span style={valueStyle}>{Math.round((settings?.volume || 1) * 100)}%</span>
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

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AudioControls;