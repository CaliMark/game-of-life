import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LifeEngine } from './utils/lifeEngine';
import { PATTERNS } from './utils/patterns';
import { soundEngine } from './utils/soundEngine';

import { CanvasViewport } from './components/CanvasViewport';
import { UnifiedControlDock } from './components/UnifiedControlDock';
import { PatternLibraryModal } from './components/PatternLibraryModal';
import { StatsHUD } from './components/StatsHUD';
import { SettingsModal } from './components/SettingsModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';

export default function App() {
  // Engine Instance
  const [gridSize, setGridSize] = useState(100);
  const [boundary, setBoundary] = useState('toroidal');
  const [ruleString, setRuleString] = useState('B3/S23');
  const engineRef = useRef(null);

  if (!engineRef.current) {
    engineRef.current = new LifeEngine(gridSize, gridSize, { boundary, rule: ruleString });
    engineRef.current.randomize(0.25);
  }
  const engine = engineRef.current;

  // Simulation Controls
  const [isRunning, setIsRunning] = useState(false);
  const [fps, setFps] = useState(25);
  const [, setTick] = useState(0); // Trigger re-render for HUD & canvas

  // Interactivity State
  const [currentTool, setCurrentTool] = useState('draw'); // 'draw' | 'erase' | 'pan' | 'stamp'
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]); // Glider default
  const [stampRotation, setStampRotation] = useState(0);
  const [stampFlipH, setStampFlipH] = useState(false);
  const [stampFlipV, setStampFlipV] = useState(false);

  // View Options
  const [showGrid, setShowGrid] = useState(true);
  const [decayTrails, setDecayTrails] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [theme, setTheme] = useState('cyberpunk');

  // Modals
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Set HTML theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = 1000 / fps;
    const timer = setInterval(() => {
      engine.step();
      if (soundEnabled && engine.births > 0) {
        soundEngine.playBirthTone(engine.population / (engine.size * 0.5));
      }
      setTick(t => t + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [isRunning, fps, soundEnabled, engine]);

  // Handle Step Forward
  const handleStep = useCallback(() => {
    engine.step();
    if (soundEnabled && engine.births > 0) {
      soundEngine.playBirthTone(engine.population / (engine.size * 0.5));
    }
    setTick(t => t + 1);
  }, [engine, soundEnabled]);

  // Handle Clear
  const handleClear = useCallback(() => {
    engine.clear();
    setIsRunning(false);
    setTick(t => t + 1);
  }, [engine]);

  // Handle Randomize
  const handleRandomize = useCallback(() => {
    engine.randomize(0.25);
    setTick(t => t + 1);
  }, [engine]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      } else if (e.code === 'KeyR') {
        handleRandomize();
      } else if (e.code === 'KeyC') {
        handleClear();
      } else if (e.code === 'KeyS' && !isRunning) {
        handleStep();
      } else if (e.code === 'KeyM') {
        setSoundEnabled(prev => soundEngine.toggle());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRandomize, handleClear, handleStep, isRunning]);

  // Settings updates
  const handleChangeGridSize = (newSize) => {
    setGridSize(newSize);
    engine.resize(newSize, newSize);
    setTick(t => t + 1);
  };

  const handleChangeBoundary = (newBoundary) => {
    setBoundary(newBoundary);
    engine.boundary = newBoundary;
    setTick(t => t + 1);
  };

  const handleChangeRule = (newRule) => {
    setRuleString(newRule);
    engine.setRules(newRule);
    setTick(t => t + 1);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* App Header (Brand + Top Right View & Environmental Actions) */}
      <header className="app-header glass-panel">
        <div className="brand-title">
          <div className="brand-icon" />
          <span>Game of Life</span>
        </div>

        <div className="header-actions">
          {/* Grid Toggle */}
          <button
            className={`btn-icon ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(g => !g)}
            title="Toggle Grid Lines"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
            </svg>
          </button>

          {/* Sound Toggle */}
          <button
            className={`btn-icon ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled(soundEngine.toggle())}
            title="Toggle Ambient Audio (M)"
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

          {/* Theme Selector */}
          <button
            className="btn-icon"
            onClick={() => setIsThemeModalOpen(true)}
            title="Color Themes"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
            </svg>
          </button>

          {/* Settings Modal */}
          <button
            className="btn-icon"
            onClick={() => setIsSettingsModalOpen(true)}
            title="Simulation Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Floating Live HUD Stats */}
      <StatsHUD engine={engine} isRunning={isRunning} />

      {/* Main Canvas Viewport */}
      <CanvasViewport
        engine={engine}
        currentTool={currentTool}
        selectedPattern={selectedPattern}
        stampRotation={stampRotation}
        stampFlipH={stampFlipH}
        stampFlipV={stampFlipV}
        showGrid={showGrid}
        decayTrails={decayTrails}
        theme={theme}
      />

      {/* Unified Single-Row Control Dock at Bottom */}
      <UnifiedControlDock
        isRunning={isRunning}
        onTogglePlay={() => setIsRunning(r => !r)}
        onStep={handleStep}
        onClear={handleClear}
        onRandomize={handleRandomize}
        fps={fps}
        onFpsChange={setFps}
        currentTool={currentTool}
        onSelectTool={setCurrentTool}
        selectedPattern={selectedPattern}
        onOpenPatternModal={() => setIsPatternModalOpen(true)}
        stampRotation={stampRotation}
        onRotateStamp={() => setStampRotation(r => (r + 90) % 360)}
        stampFlipH={stampFlipH}
        onToggleFlipH={() => setStampFlipH(f => !f)}
      />

      {/* Modals */}
      <PatternLibraryModal
        isOpen={isPatternModalOpen}
        onClose={() => setIsPatternModalOpen(false)}
        onSelectPattern={(pattern) => {
          setSelectedPattern(pattern);
          setCurrentTool('stamp');
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        engine={engine}
        gridSize={gridSize}
        onChangeGridSize={handleChangeGridSize}
        boundary={boundary}
        onChangeBoundary={handleChangeBoundary}
        ruleString={ruleString}
        onChangeRule={handleChangeRule}
        decayTrails={decayTrails}
        onToggleDecayTrails={() => setDecayTrails(d => !d)}
      />

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={setTheme}
      />
    </div>
  );
}
