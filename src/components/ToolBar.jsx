import React from 'react';

export const ToolBar = ({
  currentTool,
  onSelectTool,
  selectedPattern,
  onOpenPatternModal,
  stampRotation,
  onRotateStamp,
  stampFlipH,
  onToggleFlipH,
  showGrid,
  onToggleGrid,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenThemeModal
}) => {
  return (
    <div className="tool-selector-bar glass-panel" style={{ margin: '0 auto 8px auto' }}>
      {/* Draw Tool */}
      <button
        className={`tool-btn ${currentTool === 'draw' ? 'active' : ''}`}
        onClick={() => onSelectTool('draw')}
        title="Draw Cells"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 19l7-7 3 3-7 7-3 0 0-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        </svg>
        <span>Draw</span>
      </button>

      {/* Erase Tool */}
      <button
        className={`tool-btn ${currentTool === 'erase' ? 'active' : ''}`}
        onClick={() => onSelectTool('erase')}
        title="Erase Cells"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 20H7L3 16C2.5 15.5 2.5 14.7 3 14.2L13.2 4C13.7 3.5 14.5 3.5 15 4L20 9C20.5 9.5 20.5 10.3 20 10.8L11 19.8" />
        </svg>
        <span>Erase</span>
      </button>

      {/* Pan Tool */}
      <button
        className={`tool-btn ${currentTool === 'pan' ? 'active' : ''}`}
        onClick={() => onSelectTool('pan')}
        title="Pan Canvas"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 0 1 2 2v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
        <span>Pan</span>
      </button>

      {/* Stamp / Patterns Tool */}
      <button
        className={`tool-btn ${currentTool === 'stamp' ? 'active' : ''}`}
        onClick={() => {
          onSelectTool('stamp');
          if (!selectedPattern) onOpenPatternModal();
        }}
        title="Stamp Pattern"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
        <span>{selectedPattern ? selectedPattern.name : 'Stamp'}</span>
      </button>

      {/* Pattern Library Picker */}
      <button
        className="tool-btn"
        onClick={onOpenPatternModal}
        title="Open Preset Library"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Rotation & Flip Controls if Stamp Tool is Selected */}
      {currentTool === 'stamp' && selectedPattern && (
        <>
          <button
            className="tool-btn"
            onClick={onRotateStamp}
            title={`Rotate Pattern (${stampRotation}°)`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{stampRotation}°</span>
          </button>
          <button
            className={`tool-btn ${stampFlipH ? 'active' : ''}`}
            onClick={onToggleFlipH}
            title="Flip Horizontal"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M4 12l4-4v8l-4-4zm16 0l-4-4v8l4-4z" />
            </svg>
          </button>
        </>
      )}

      <div className="divider" />

      {/* Grid Line Toggle */}
      <button
        className={`tool-btn ${showGrid ? 'active' : ''}`}
        onClick={onToggleGrid}
        title="Toggle Grid Lines"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      </button>

      {/* Sound Toggle */}
      <button
        className={`tool-btn ${soundEnabled ? 'active' : ''}`}
        onClick={onToggleSound}
        title="Toggle Ambient Audio Synth"
      >
        {soundEnabled ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>

      {/* Themes */}
      <button
        className="tool-btn"
        onClick={onOpenThemeModal}
        title="Switch Themes"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
        </svg>
      </button>

      {/* Settings */}
      <button
        className="tool-btn"
        onClick={onOpenSettings}
        title="Settings & Custom Rules"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </div>
  );
};
