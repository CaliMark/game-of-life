import React from 'react';

export const ControlBar = ({
  isRunning,
  onTogglePlay,
  onStep,
  onClear,
  onRandomize,
  fps,
  onFpsChange
}) => {
  return (
    <div className="bottom-controls-wrapper">
      <div className="main-toolbar glass-panel">
        {/* Play/Pause Primary Action */}
        <button
          className="btn-primary"
          onClick={onTogglePlay}
          title={isRunning ? 'Pause Simulation (Space)' : 'Start Simulation (Space)'}
        >
          {isRunning ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              <span>Pause</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              <span>Play</span>
            </>
          )}
        </button>

        {/* Step Forward */}
        <button
          className="btn-icon"
          onClick={onStep}
          disabled={isRunning}
          title="Single Generation Step"
          style={{ opacity: isRunning ? 0.4 : 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5,4 15,12 5,20" fill="currentColor" />
            <line x1="19" y1="5" x2="19" y2="19" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>

        <div className="divider" />

        {/* Randomize */}
        <button
          className="btn-icon"
          onClick={onRandomize}
          title="Randomize Population (R)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="4" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="16" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </button>

        {/* Clear */}
        <button
          className="btn-icon"
          onClick={onClear}
          title="Clear Grid (C)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>

        <div className="divider" />

        {/* Speed / FPS Slider */}
        <div className="speed-slider-container">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
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
      </div>
    </div>
  );
};
