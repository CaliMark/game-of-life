import React from 'react';

export const StatsHUD = ({ engine, isRunning }) => {
  if (!engine) return null;

  const history = engine.popHistory || [];
  const maxPop = Math.max(...history, 1);
  const minPop = Math.min(...history, 0);

  // Generate SVG Sparkline Points
  const points = history.map((val, idx) => {
    const x = (idx / Math.max(history.length - 1, 1)) * 120;
    const norm = (val - minPop) / (maxPop - minPop || 1);
    const y = 30 - norm * 26;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="stats-hud glass-panel">
      <div className="stat-row">
        <span>Generation</span>
        <span className="stat-value">{engine.generation.toLocaleString()}</span>
      </div>
      <div className="stat-row">
        <span>Population</span>
        <span className="stat-value">{engine.population.toLocaleString()}</span>
      </div>
      <div className="stat-row">
        <span>Births / Deaths</span>
        <span className="stat-value" style={{ fontSize: '0.75rem' }}>
          +{engine.births} / -{engine.deaths}
        </span>
      </div>

      {/* Mini Sparkline Graph */}
      {history.length > 1 && (
        <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid var(--glass-border)' }}>
          <svg width="120" height="32" style={{ overflow: 'visible' }}>
            <polyline
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="2"
              points={points}
            />
          </svg>
        </div>
      )}
    </div>
  );
};
