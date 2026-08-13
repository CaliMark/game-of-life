import React from 'react';

export const UnifiedControlDock = ({
  // Playback Props
  isRunning,
  onTogglePlay,
  onStep,
  onClear,
  onRandomize,
  fps,
  onFpsChange,

  // Undo / Redo Props
  canUndo,
  onUndo,
  canRedo,
  onRedo,

  // Tool Props
  currentTool,
  onSelectTool,
  selectedPattern,
  onOpenPatternModal,
  stampRotation,
  onRotateStamp,
  stampFlipH,
  onToggleFlipH
}) => {
  return (
    <>
      {/* Mobile Top Tools Bar (Visible ONLY on mobile devices max-width: 640px) */}
      <div className="mobile-tools-bar glass-panel">
        <button
          className={`tool-btn ${currentTool === 'draw' ? 'active' : ''}`}
          onClick={() => onSelectTool('draw')}
          title="Draw Cells"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 19l7-7 3 3-7 7-3 0 0-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          </svg>
          <span>Draw</span>
        </button>

        <button
          className={`tool-btn ${currentTool === 'erase' ? 'active' : ''}`}
          onClick={() => onSelectTool('erase')}
          title="Erase Cells"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20 20H7L3 16C2.5 15.5 2.5 14.7 3 14.2L13.2 4C13.7 3.5 14.5 3.5 15 4L20 9C20.5 9.5 20.5 10.3 20 10.8L11 19.8" />
          </svg>
          <span>Erase</span>
        </button>

        <button
          className={`tool-btn ${currentTool === 'pan' ? 'active' : ''}`}
          onClick={() => onSelectTool('pan')}
          title="Pan View"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 0 1 2 2v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
          </svg>
          <span>Pan</span>
        </button>

        <button
          className={`tool-btn ${currentTool === 'stamp' ? 'active' : ''}`}
          onClick={() => {
            onSelectTool('stamp');
            if (!selectedPattern) onOpenPatternModal();
          }}
          title="Stamp Pattern"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
          <span>Stamp</span>
        </button>

        <button
          className="tool-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          style={{ opacity: canUndo ? 1 : 0.4 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
          </svg>
          <span>Undo</span>
        </button>

        <button
          className="tool-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          style={{ opacity: canRedo ? 1 : 0.4 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 15-6.7L21 13" />
          </svg>
          <span>Redo</span>
        </button>
      </div>

      {/* Main Bottom Control Dock */}
      <div className="bottom-dock-wrapper">
        {/* Contextual Stamp Sub-Bar (Appears when Stamp tool is selected) */}
        {currentTool === 'stamp' && selectedPattern && (
          <div className="stamp-sub-bar glass-panel">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginRight: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <strong style={{ color: 'var(--accent-primary)' }}>{selectedPattern.name}</strong>
            </span>
            <button className="tool-btn" onClick={onOpenPatternModal} title="Change Pattern">
              Change
            </button>
            <button className="tool-btn" onClick={onRotateStamp} title={`Rotate (${stampRotation}°)`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>{stampRotation}°</span>
            </button>
            <button className={`tool-btn ${stampFlipH ? 'active' : ''}`} onClick={onToggleFlipH} title="Flip Horizontal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M4 12l4-4v8l-4-4zm16 0l-4-4v8l4-4z" />
              </svg>
            </button>
          </div>
        )}

        {/* Main Dock Container */}
        <div className="unified-dock glass-panel">
          {/* Playback Controls (Play/Pause, Step, Speed, Randomize, Clear) */}
          <div className="dock-tier playback-tier">
            <button
              className="btn-primary"
              onClick={onTogglePlay}
              title={isRunning ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isRunning ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              className="btn-icon"
              onClick={onStep}
              disabled={isRunning}
              title="Single Step (S)"
              style={{ opacity: isRunning ? 0.4 : 1 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5,4 15,12 5,20" fill="currentColor" />
                <line x1="19" y1="5" x2="19" y2="19" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>

            <button
              className="btn-icon"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              style={{ opacity: canUndo ? 1 : 0.4 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
              </svg>
            </button>

            <button
              className="btn-icon"
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              style={{ opacity: canRedo ? 1 : 0.4 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 7v6h-6" />
                <path d="M3 17a9 9 0 0 1 15-6.7L21 13" />
              </svg>
            </button>

            <div className="speed-slider-container">
              <input
                type="range"
                min="1"
                max="60"
                value={fps}
                onChange={(e) => onFpsChange(Number(e.target.value))}
                className="speed-slider"
                title={`Speed: ${fps} FPS`}
              />
              <span>{fps} FPS</span>
            </div>

            <button className="btn-icon" onClick={onRandomize} title="Randomize (R)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="2" width="20" height="20" rx="4" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="16" cy="16" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="16" cy="8" r="1.5" fill="currentColor" />
                <circle cx="8" cy="16" r="1.5" fill="currentColor" />
              </svg>
            </button>

            <button className="btn-icon" onClick={onClear} title="Clear Grid (C)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>

          <div className="divider" />

          {/* Desktop Interactive Tools (Draw, Erase, Pan, Stamp) */}
          <div className="dock-tier tools-tier">
            <button
              className={`tool-btn ${currentTool === 'draw' ? 'active' : ''}`}
              onClick={() => onSelectTool('draw')}
              title="Draw Cells"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 19l7-7 3 3-7 7-3 0 0-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              </svg>
              <span>Draw</span>
            </button>

            <button
              className={`tool-btn ${currentTool === 'erase' ? 'active' : ''}`}
              onClick={() => onSelectTool('erase')}
              title="Erase Cells"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 20H7L3 16C2.5 15.5 2.5 14.7 3 14.2L13.2 4C13.7 3.5 14.5 3.5 15 4L20 9C20.5 9.5 20.5 10.3 20 10.8L11 19.8" />
              </svg>
              <span>Erase</span>
            </button>

            <button
              className={`tool-btn ${currentTool === 'pan' ? 'active' : ''}`}
              onClick={() => onSelectTool('pan')}
              title="Pan View"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 0 1 2 2v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
              <span>Pan</span>
            </button>

            <button
              className={`tool-btn ${currentTool === 'stamp' ? 'active' : ''}`}
              onClick={() => {
                onSelectTool('stamp');
                if (!selectedPattern) onOpenPatternModal();
              }}
              title="Stamp Pattern"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              <span>Stamp</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
