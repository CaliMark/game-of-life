import React, { useEffect, useRef, useState } from 'react';
import { PATTERNS } from '../utils/patterns';

const PatternCard = ({ pattern, onSelect }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const matrix = pattern.matrix;
    const pHeight = matrix.length;
    const pWidth = matrix[0].length;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0a0c14';
    ctx.fillRect(0, 0, width, height);

    const cellSize = Math.min(
      Math.floor((width - 12) / pWidth),
      Math.floor((height - 12) / pHeight),
      12
    );

    const startX = Math.floor((width - pWidth * cellSize) / 2);
    const startY = Math.floor((height - pHeight * cellSize) / 2);

    ctx.fillStyle = '#00f0ff';
    for (let r = 0; r < pHeight; r++) {
      for (let c = 0; c < pWidth; c++) {
        if (matrix[r][c] === 1) {
          ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
  }, [pattern]);

  return (
    <div className="pattern-card" onClick={() => onSelect(pattern)}>
      <canvas ref={canvasRef} width="80" height="80" className="pattern-preview-canvas" />
      <span className="pattern-name">{pattern.name}</span>
      <span className="pattern-category">{pattern.category}</span>
    </div>
  );
};

export const PatternLibraryModal = ({ isOpen, onClose, onSelectPattern }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Spaceships', 'Oscillators', 'Guns', 'Methuselahs'];
  const filteredPatterns = selectedCategory === 'All'
    ? PATTERNS
    : PATTERNS.filter(p => p.category === selectedCategory);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Pattern Library</h2>
          <button className="btn-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`tool-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pattern Cards Grid */}
          <div className="pattern-grid">
            {filteredPatterns.map(pattern => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                onSelect={(p) => {
                  onSelectPattern(p);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
