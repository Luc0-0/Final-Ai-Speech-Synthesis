import { useState } from 'react';

const AzureSettings = ({ onUpdateCredentials }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [credentials, setCredentials] = useState({
    key: '',
    region: 'japaneast'
  });

  const handleSave = () => {
    if (credentials.key.trim()) {
      onUpdateCredentials(credentials);
      setIsOpen(false);
    }
  };

  const panelStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '20px',
    minWidth: '300px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  };

  const buttonStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 999,
    background: 'rgba(59, 130, 246, 0.8)',
    backdropFilter: 'blur(10px)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const saveButtonStyle = {
    background: 'rgba(34, 197, 94, 0.8)',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginRight: '10px'
  };

  const cancelButtonStyle = {
    background: 'rgba(239, 68, 68, 0.8)',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  };

  if (!isOpen) {
    return (
      <button 
        style={buttonStyle}
        onClick={() => setIsOpen(true)}
      >
        ⚙️ Azure Settings
      </button>
    );
  }

  return (
    <div style={panelStyle}>
      <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '16px' }}>
        Azure Speech Settings
      </h3>
      
      <input
        type="text"
        placeholder="Azure Speech API Key"
        value={credentials.key}
        onChange={(e) => setCredentials({...credentials, key: e.target.value})}
        style={inputStyle}
      />
      
      <select
        value={credentials.region}
        onChange={(e) => setCredentials({...credentials, region: e.target.value})}
        style={selectStyle}
      >
        <option value="japaneast">Japan East</option>
        <option value="eastus">East US</option>
        <option value="westus">West US</option>
        <option value="westeurope">West Europe</option>
        <option value="southeastasia">Southeast Asia</option>
        <option value="australiaeast">Australia East</option>
      </select>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button onClick={handleSave} style={saveButtonStyle}>
          Save
        </button>
        <button onClick={() => setIsOpen(false)} style={cancelButtonStyle}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AzureSettings;