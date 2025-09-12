const CommandHistory = ({ history = [], onClearHistory }) => {
  const panelStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(24px)',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    padding: '32px 28px',
    height: 'fit-content',
    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
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

  const scrollContainerStyle = {
    maxHeight: '500px',
    overflowY: 'auto',
    paddingRight: '8px',
    marginRight: '-8px'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '48px 24px',
    color: 'rgba(255, 255, 255, 0.6)'
  };

  const historyItemStyle = {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(8px)',
    position: 'relative',
    overflow: 'hidden'
  };

  const numberBadgeStyle = {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '700',
    flexShrink: 0,
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
  };

  const timestampStyle = {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '12px',
    fontWeight: '500'
  };

  const messageContainerStyle = {
    marginBottom: '16px'
  };

  const messageLabelStyle = {
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center'
  };

  const messageContentStyle = (isUser) => ({
    padding: '16px 20px',
    borderRadius: '16px',
    fontSize: '0.9rem',
    fontWeight: '500',
    lineHeight: '1.5',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    background: isUser 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(59, 130, 246, 0.15)'
  });

  const clearButtonStyle = {
    width: '100%',
    color: 'rgba(255, 255, 255, 0.6)',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '24px',
    fontWeight: '500',
    backdropFilter: 'blur(8px)'
  };

  const hoverOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255, 255, 255, 0.02)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  };

  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>
        <span style={{ marginRight: '16px', fontSize: '1.5rem' }}>📝</span>
        Command History
      </h2>

      <div style={scrollContainerStyle}>
        {history.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🤖
            </div>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              No conversations yet
            </h3>
            <p style={{ 
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: '1.5'
            }}>
              Start speaking to see your conversation history appear here
            </p>
          </div>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              style={historyItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={numberBadgeStyle}>
                  {index + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={timestampStyle}>{item.timestamp}</div>
                  
                  <div style={messageContainerStyle}>
                    <div style={messageLabelStyle}>
                      <span style={{ marginRight: '8px' }}>👤</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>You said:</span>
                    </div>
                    <div style={messageContentStyle(true)}>
                      "{item.command}"
                    </div>
                  </div>
                  
                  <div>
                    <div style={messageLabelStyle}>
                      <span style={{ marginRight: '8px' }}>
                        {item.commandType === 'time' ? '🕰️' :
                         item.commandType === 'date' ? '📅' :
                         item.commandType === 'timer' ? '⏲️' :
                         item.commandType === 'joke' ? '😂' :
                         item.commandType === 'timer_complete' ? '⏰' : '🤖'}
                      </span>
                      <span style={{ color: item.success ? '#93c5fd' : '#f87171' }}>AI responded:</span>
                    </div>
                    <div style={messageContentStyle(false)}>
                      {item.response}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <button 
          style={clearButtonStyle}
          onClick={onClearHistory}
          onMouseEnter={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.9)';
            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.6)';
            e.target.style.background = 'rgba(255, 255, 255, 0.04)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          🗑️ Clear History
        </button>
      )}

      <style>{`
        /* Custom scrollbar */
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default CommandHistory;