import React from 'react';

export const ThemeSelectorModal = ({ isOpen, onClose, currentTheme, onSelectTheme }) => {
  if (!isOpen) return null;

  const themes = [
    { id: 'cyberpunk', name: 'Cyberpunk Neon', primary: '#00f0ff', decay: '#ff007f', bg: '#0a0c14' },
    { id: 'bioluminescence', name: 'Bioluminescence', primary: '#00ffd5', decay: '#10b981', bg: '#031417' },
    { id: 'deepspace', name: 'Deep Space Violet', primary: '#c084fc', decay: '#ec4899', bg: '#0f081d' },
    { id: 'matrix', name: 'Matrix Emerald', primary: '#34d399', decay: '#4ade80', bg: '#020b05' },
    { id: 'amber', name: 'Solarized Amber', primary: '#fbbf24', decay: '#ef4444', bg: '#120c04' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Color Themes</h2>
          <button className="btn-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
          {themes.map(t => (
            <div
              key={t.id}
              className={`pattern-card ${currentTheme === t.id ? 'active' : ''}`}
              style={{
                borderColor: currentTheme === t.id ? t.primary : 'var(--glass-border)',
                background: currentTheme === t.id ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)'
              }}
              onClick={() => {
                onSelectTheme(t.id);
                onClose();
              }}
            >
              <div style={{
                width: '100%',
                height: '60px',
                borderRadius: '8px',
                background: t.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.primary, boxShadow: `0 0 8px ${t.primary}` }} />
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.decay }} />
              </div>
              <span className="pattern-name">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
