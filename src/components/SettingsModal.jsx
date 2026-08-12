import React, { useState } from 'react';

export const SettingsModal = ({
  isOpen,
  onClose,
  engine,
  gridSize,
  onChangeGridSize,
  boundary,
  onChangeBoundary,
  ruleString,
  onChangeRule,
  decayTrails,
  onToggleDecayTrails
}) => {
  const [customRule, setCustomRule] = useState(ruleString);

  if (!isOpen) return null;

  const rulePresets = [
    { label: "Standard Conway (B3/S23)", value: "B3/S23" },
    { label: "HighLife (B36/S23)", value: "B36/S23" },
    { label: "Seeds (B2/S)", value: "B2/S" },
    { label: "Day & Night (B3678/S34678)", value: "B3678/S34678" },
    { label: "Life Without Death (B3/S012345678)", value: "B3/S012345678" }
  ];

  const handleRuleSubmit = (e) => {
    e.preventDefault();
    onChangeRule(customRule);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Simulation Settings</h2>
          <button className="btn-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Grid Size */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
              Grid Dimensions
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: '50 × 50', val: 50 },
                { label: '100 × 100', val: 100 },
                { label: '180 × 180', val: 180 },
                { label: '250 × 250', val: 250 }
              ].map(item => (
                <button
                  key={item.val}
                  className={`tool-btn ${gridSize === item.val ? 'active' : ''}`}
                  onClick={() => onChangeGridSize(item.val)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Boundary Mode */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
              Grid Boundary Mode
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`tool-btn ${boundary === 'toroidal' ? 'active' : ''}`}
                onClick={() => onChangeBoundary('toroidal')}
              >
                Toroidal (Wrap Around)
              </button>
              <button
                className={`tool-btn ${boundary === 'bounded' ? 'active' : ''}`}
                onClick={() => onChangeBoundary('bounded')}
              >
                Bounded (Hard Edges)
              </button>
            </div>
          </div>

          {/* Decay Trails */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={decayTrails}
                onChange={onToggleDecayTrails}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              Enable Cell Decay Glow Trails
            </label>
          </div>

          {/* Rules Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
              Simulation Ruleset
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              {rulePresets.map(preset => (
                <button
                  key={preset.value}
                  className={`tool-btn ${ruleString === preset.value ? 'active' : ''}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => {
                    setCustomRule(preset.value);
                    onChangeRule(preset.value);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleRuleSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={customRule}
                onChange={(e) => setCustomRule(e.target.value)}
                placeholder="Custom Rule e.g. B3/S23"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <button type="submit" className="tool-btn active">Apply</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
