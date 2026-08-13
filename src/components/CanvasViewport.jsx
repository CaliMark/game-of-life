import React, { useRef, useEffect, useState, useCallback } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const CanvasViewport = ({
  engine,
  currentTool,
  selectedPattern,
  stampRotation,
  stampFlipH,
  stampFlipV,
  showGrid,
  decayTrails,
  theme,
  isTesting = false,
  onEditComplete
}) => {
  const canvasRef = useRef(null);

  // Camera transform state
  const [camera, setCamera] = useState({
    zoom: 12, // pixels per cell
    offsetX: 0,
    offsetY: 0
  });

  // Interaction tracking state
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef(null);
  const touchMidpointRef = useRef({ x: 0, y: 0 });

  // Pattern hover preview position in grid coords
  const [hoverGridPos, setHoverGridPos] = useState(null);

  // Center camera on initial load
  useEffect(() => {
    if (canvasRef.current && engine) {
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      const gridPixelW = engine.cols * camera.zoom;
      const gridPixelH = engine.rows * camera.zoom;

      setCamera(prev => ({
        ...prev,
        offsetX: Math.floor((width - gridPixelW) / 2),
        offsetY: Math.floor((height - gridPixelH) / 2)
      }));
    }
  }, [engine?.cols, engine?.rows]);

  // Convert screen coordinates (px) to grid cell coordinates (col, row)
  const screenToGrid = useCallback((screenX, screenY) => {
    if (!canvasRef.current || !engine) return { col: 0, row: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = screenX - rect.left - camera.offsetX;
    const y = screenY - rect.top - camera.offsetY;

    const col = Math.floor(x / camera.zoom);
    const row = Math.floor(y / camera.zoom);

    return { col, row };
  }, [camera, engine]);

  // Handle cell drawing or erasing
  const handleCellAction = useCallback((screenX, screenY, isErase = false) => {
    const { col, row } = screenToGrid(screenX, screenY);
    if (col >= 0 && col < engine.cols && row >= 0 && row < engine.rows) {
      engine.setCell(col, row, isErase ? 0 : 1);
      soundEngine.triggerHaptic();
    }
  }, [engine, screenToGrid]);

  // Render Loop
  useEffect(() => {
    let animationFrameId;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas || !engine) return;

      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Get styles from CSS variables
      const computedStyle = getComputedStyle(document.documentElement);
      const bgPrimary = computedStyle.getPropertyValue('--bg-primary').trim() || '#0a0c14';
      const cellAlive = computedStyle.getPropertyValue('--cell-alive').trim() || '#00f0ff';
      const cellDecay = computedStyle.getPropertyValue('--cell-decay').trim() || 'rgba(255, 0, 127, 0.6)';
      const gridColor = computedStyle.getPropertyValue('--grid-line').trim() || 'rgba(255, 255, 255, 0.05)';
      const accentGlow = computedStyle.getPropertyValue('--accent-glow').trim() || 'rgba(0, 240, 255, 0.4)';

      // Clear background
      ctx.fillStyle = bgPrimary;
      ctx.fillRect(0, 0, width, height);

      const zoom = camera.zoom;
      const offsetX = camera.offsetX;
      const offsetY = camera.offsetY;

      // Draw Grid Lines if enabled & zoom level is large enough
      if (showGrid && zoom >= 4) {
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();

        const startCol = Math.max(0, Math.floor(-offsetX / zoom));
        const endCol = Math.min(engine.cols, Math.ceil((width - offsetX) / zoom));
        const startRow = Math.max(0, Math.floor(-offsetY / zoom));
        const endRow = Math.min(engine.rows, Math.ceil((height - offsetY) / zoom));

        for (let c = startCol; c <= endCol; c++) {
          const x = offsetX + c * zoom;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }

        for (let r = startRow; r <= endRow; r++) {
          const y = offsetY + r * zoom;
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
      }

      // Draw Cells & Decay Trails
      const cols = engine.cols;
      const rows = engine.rows;
      const grid = engine.grid;
      const decayGrid = engine.decayGrid;

      // Optional cell glow
      if (zoom >= 8) {
        ctx.shadowColor = accentGlow;
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowBlur = 0;
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const isAlive = grid[idx] === 1;
          const decayVal = decayGrid[idx];

          const x = offsetX + c * zoom;
          const y = offsetY + r * zoom;

          // Culling check
          if (x + zoom < 0 || x > width || y + zoom < 0 || y > height) continue;

          if (isAlive) {
            ctx.fillStyle = cellAlive;
            ctx.fillRect(x + 0.5, y + 0.5, zoom - 1, zoom - 1);
          } else if (decayTrails && decayVal > 0) {
            const alpha = (decayVal / 255) * 0.5;
            ctx.fillStyle = cellDecay.replace(/[\d.]+\)$/g, `${alpha})`);
            ctx.fillRect(x + 0.5, y + 0.5, zoom - 1, zoom - 1);
          }
        }
      }

      ctx.shadowBlur = 0; // Reset shadow

      // Render Pattern Placement Preview (if Stamp Tool is Active)
      if (currentTool === 'stamp' && selectedPattern && hoverGridPos) {
        const matrix = selectedPattern.matrix;
        const pHeight = matrix.length;
        const pWidth = matrix[0].length;
        const startX = hoverGridPos.col - Math.floor(pWidth / 2);
        const startY = hoverGridPos.row - Math.floor(pHeight / 2);

        ctx.fillStyle = cellAlive;
        ctx.globalAlpha = 0.45;

        for (let py = 0; py < pHeight; py++) {
          for (let px = 0; px < pWidth; px++) {
            if (matrix[py][px] === 1) {
              const gx = startX + px;
              const gy = startY + py;
              const x = offsetX + gx * zoom;
              const y = offsetY + gy * zoom;

              ctx.fillRect(x + 0.5, y + 0.5, zoom - 1, zoom - 1);
            }
          }
        }
        ctx.globalAlpha = 1.0;
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [camera, engine, showGrid, decayTrails, theme, currentTool, selectedPattern, hoverGridPos]);

  // Mouse Handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    engine.beginUndoBatch();

    if (currentTool === 'pan' || e.button === 1 || e.button === 2) {
      // Middle or Right click defaults to pan
      return;
    }

    if (currentTool === 'draw') {
      handleCellAction(e.clientX, e.clientY, false);
    } else if (currentTool === 'erase') {
      handleCellAction(e.clientX, e.clientY, true);
    } else if (currentTool === 'stamp' && selectedPattern) {
      const { col, row } = screenToGrid(e.clientX, e.clientY);
      engine.stampPattern(col, row, selectedPattern.matrix, stampRotation, stampFlipH, stampFlipV);
      soundEngine.triggerHaptic();
    }
  };

  const handleMouseMove = (e) => {
    const { col, row } = screenToGrid(e.clientX, e.clientY);
    setHoverGridPos({ col, row });

    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    if (currentTool === 'pan' || e.buttons === 4 || e.buttons === 2) {
      setCamera(prev => ({
        ...prev,
        offsetX: prev.offsetX + dx,
        offsetY: prev.offsetY + dy
      }));
    } else if (currentTool === 'draw') {
      handleCellAction(e.clientX, e.clientY, false);
    } else if (currentTool === 'erase') {
      handleCellAction(e.clientX, e.clientY, true);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    engine.endUndoBatch();
    onEditComplete?.();
  };

  // Scroll Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = Math.max(2, Math.min(60, camera.zoom * zoomFactor));

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Zoom centered on cursor position
    const newOffsetX = mouseX - (mouseX - camera.offsetX) * (newZoom / camera.zoom);
    const newOffsetY = mouseY - (mouseY - camera.offsetY) * (newZoom / camera.zoom);

    setCamera({
      zoom: newZoom,
      offsetX: newOffsetX,
      offsetY: newOffsetY
    });
  };

  // Touch Gesture Handlers (Mobile Pinch-to-Zoom & Pan)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      const touch = e.touches[0];
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
      engine.beginUndoBatch();

      if (currentTool === 'draw') {
        handleCellAction(touch.clientX, touch.clientY, false);
      } else if (currentTool === 'erase') {
        handleCellAction(touch.clientX, touch.clientY, true);
      } else if (currentTool === 'stamp' && selectedPattern) {
        const { col, row } = screenToGrid(touch.clientX, touch.clientY);
        engine.stampPattern(col, row, selectedPattern.matrix, stampRotation, stampFlipH, stampFlipV);
        soundEngine.triggerHaptic();
      }
    } else if (e.touches.length === 2) {
      // Pinch distance & midpoint start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
      touchMidpointRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - lastMousePosRef.current.x;
      const dy = touch.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };

      if (currentTool === 'pan') {
        setCamera(prev => ({
          ...prev,
          offsetX: prev.offsetX + dx,
          offsetY: prev.offsetY + dy
        }));
      } else if (currentTool === 'draw') {
        handleCellAction(touch.clientX, touch.clientY, false);
      } else if (currentTool === 'erase') {
        handleCellAction(touch.clientX, touch.clientY, true);
      }
    } else if (e.touches.length === 2 && touchDistanceRef.current) {
      // Two-finger pan + pinch-to-zoom (works regardless of selected tool)
      const touch0 = e.touches[0];
      const touch1 = e.touches[1];
      const dist = Math.hypot(
        touch0.clientX - touch1.clientX,
        touch0.clientY - touch1.clientY
      );
      const midX = (touch0.clientX + touch1.clientX) / 2;
      const midY = (touch0.clientY + touch1.clientY) / 2;

      const prevDistance = touchDistanceRef.current;
      const prevMid = touchMidpointRef.current;

      const rect = canvasRef.current.getBoundingClientRect();
      const canvasMidX = midX - rect.left;
      const canvasMidY = midY - rect.top;

      // Ratio-based zoom: proportional to actual finger movement, damped
      const PINCH_ZOOM_SENSITIVITY = 0.7;
      const rawRatio = dist / prevDistance;
      const ratio = 1 + (rawRatio - 1) * PINCH_ZOOM_SENSITIVITY;
      const newZoom = Math.max(2, Math.min(60, camera.zoom * ratio));

      // Two-finger pan: follow midpoint movement
      const dx = midX - prevMid.x;
      const dy = midY - prevMid.y;
      const pannedX = camera.offsetX + dx;
      const pannedY = camera.offsetY + dy;

      // Zoom anchored at the pinch midpoint so content stays under fingers
      const newOffsetX = canvasMidX - (canvasMidX - pannedX) * (newZoom / camera.zoom);
      const newOffsetY = canvasMidY - (canvasMidY - pannedY) * (newZoom / camera.zoom);

      touchDistanceRef.current = dist;
      touchMidpointRef.current = { x: midX, y: midY };

      setCamera({ zoom: newZoom, offsetX: newOffsetX, offsetY: newOffsetY });
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchDistanceRef.current = null;
    engine.endUndoBatch();
    onEditComplete?.();
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none', // Native gestures (scroll/zoom) handled by our touch handlers
          cursor: currentTool === 'pan' ? 'grab' : currentTool === 'erase' ? 'crosshair' : 'pointer'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onContextMenu={e => e.preventDefault()}
      />
    </div>
  );
};
