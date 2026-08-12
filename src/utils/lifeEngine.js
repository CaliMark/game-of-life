/**
 * High-performance Game of Life Engine using Uint8Array
 */

export class LifeEngine {
  constructor(cols = 100, rows = 100, options = {}) {
    this.cols = cols;
    this.rows = rows;
    this.size = cols * rows;
    this.grid = new Uint8Array(this.size);
    this.nextGrid = new Uint8Array(this.size);
    this.decayGrid = new Uint8Array(this.size); // Stores age for glowing decay trails (0-255)

    this.generation = 0;
    this.population = 0;
    this.births = 0;
    this.deaths = 0;
    this.popHistory = [];

    // Boundary Mode: 'toroidal' or 'bounded'
    this.boundary = options.boundary || 'toroidal';

    // Rules: birth set and survival set
    this.setRules(options.rule || 'B3/S23');
  }

  // Parse rule string like "B3/S23", "B36/S23", "B2/S"
  setRules(ruleString) {
    this.ruleString = ruleString;
    this.birthRules = new Set();
    this.survivalRules = new Set();

    const parts = ruleString.toUpperCase().split('/');
    parts.forEach(part => {
      if (part.startsWith('B')) {
        for (let i = 1; i < part.length; i++) {
          const num = parseInt(part[i], 10);
          if (!isNaN(num)) this.birthRules.add(num);
        }
      } else if (part.startsWith('S')) {
        for (let i = 1; i < part.length; i++) {
          const num = parseInt(part[i], 10);
          if (!isNaN(num)) this.survivalRules.add(num);
        }
      }
    });
  }

  resize(cols, rows) {
    const oldCols = this.cols;
    const oldRows = this.rows;
    const oldGrid = this.grid;

    this.cols = cols;
    this.rows = rows;
    this.size = cols * rows;
    this.grid = new Uint8Array(this.size);
    this.nextGrid = new Uint8Array(this.size);
    this.decayGrid = new Uint8Array(this.size);

    // Copy existing cells centered into new grid
    const startX = Math.floor((cols - oldCols) / 2);
    const startY = Math.floor((rows - oldRows) / 2);

    for (let r = 0; r < oldRows; r++) {
      for (let c = 0; c < oldCols; c++) {
        const newX = startX + c;
        const newY = startY + r;
        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
          const val = oldGrid[r * oldCols + c];
          this.grid[newY * cols + newX] = val;
        }
      }
    }
    this.recalculateStats();
  }

  getIndex(x, y) {
    return y * this.cols + x;
  }

  getCell(x, y) {
    if (this.boundary === 'toroidal') {
      const tx = (x + this.cols) % this.cols;
      const ty = (y + this.rows) % this.rows;
      return this.grid[ty * this.cols + tx];
    } else {
      if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return 0;
      return this.grid[y * this.cols + x];
    }
  }

  setCell(x, y, value) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
    const idx = this.getIndex(x, y);
    const prev = this.grid[idx];
    this.grid[idx] = value ? 1 : 0;
    if (value && !prev) this.decayGrid[idx] = 255; // Reset decay intensity
    if (!value && prev) this.decayGrid[idx] = 200; // Start fading decay
  }

  toggleCell(x, y) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
    const idx = this.getIndex(x, y);
    const current = this.grid[idx];
    this.setCell(x, y, current ? 0 : 1);
    this.recalculateStats();
  }

  clear() {
    this.grid.fill(0);
    this.nextGrid.fill(0);
    this.decayGrid.fill(0);
    this.generation = 0;
    this.population = 0;
    this.births = 0;
    this.deaths = 0;
    this.popHistory = [];
  }

  randomize(density = 0.2) {
    this.clear();
    let pop = 0;
    for (let i = 0; i < this.size; i++) {
      if (Math.random() < density) {
        this.grid[i] = 1;
        this.decayGrid[i] = 255;
        pop++;
      }
    }
    this.population = pop;
  }

  countNeighbors(x, y) {
    let count = 0;
    const cols = this.cols;
    const rows = this.rows;
    const isToroidal = this.boundary === 'toroidal';

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        let nx = x + dx;
        let ny = y + dy;

        if (isToroidal) {
          nx = (nx + cols) % cols;
          ny = (ny + rows) % rows;
          count += this.grid[ny * cols + nx];
        } else {
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            count += this.grid[ny * cols + nx];
          }
        }
      }
    }
    return count;
  }

  step() {
    let pop = 0;
    let birthCount = 0;
    let deathCount = 0;
    const cols = this.cols;
    const rows = this.rows;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;
        const currentState = this.grid[idx];
        const neighbors = this.countNeighbors(x, y);

        let nextState = 0;

        if (currentState === 1) {
          if (this.survivalRules.has(neighbors)) {
            nextState = 1;
          } else {
            nextState = 0;
            deathCount++;
          }
        } else {
          if (this.birthRules.has(neighbors)) {
            nextState = 1;
            birthCount++;
          } else {
            nextState = 0;
          }
        }

        this.nextGrid[idx] = nextState;

        // Decay trail calculation
        if (nextState === 1) {
          this.decayGrid[idx] = 255;
          pop++;
        } else {
          if (this.decayGrid[idx] > 0) {
            this.decayGrid[idx] = Math.max(0, this.decayGrid[idx] - 25); // Gradual fade out
          }
        }
      }
    }

    // Swap grid buffers
    const temp = this.grid;
    this.grid = this.nextGrid;
    this.nextGrid = temp;

    this.generation++;
    this.population = pop;
    this.births = birthCount;
    this.deaths = deathCount;

    // Keep last 30 generation history for HUD graph
    this.popHistory.push(pop);
    if (this.popHistory.length > 30) this.popHistory.shift();
  }

  recalculateStats() {
    let pop = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.grid[i] === 1) pop++;
    }
    this.population = pop;
  }

  // Stamp a 2D matrix pattern into the grid centered at (cx, cy)
  stampPattern(cx, cy, matrix, rotationDegrees = 0, flipH = false, flipV = false) {
    let transformed = matrix;

    // Apply Flip
    if (flipH) {
      transformed = transformed.map(row => [...row].reverse());
    }
    if (flipV) {
      transformed = [...transformed].reverse();
    }

    // Apply Rotation (90, 180, 270)
    const rotations = Math.floor(((rotationDegrees % 360) + 360) % 360 / 90);
    for (let r = 0; r < rotations; r++) {
      const pRows = transformed.length;
      const pCols = transformed[0].length;
      const rotated = Array.from({ length: pCols }, () => Array(pRows).fill(0));
      for (let y = 0; y < pRows; y++) {
        for (let x = 0; x < pCols; x++) {
          rotated[x][pRows - 1 - y] = transformed[y][x];
        }
      }
      transformed = rotated;
    }

    const pHeight = transformed.length;
    const pWidth = transformed[0].length;
    const startX = cx - Math.floor(pWidth / 2);
    const startY = cy - Math.floor(pHeight / 2);

    for (let py = 0; py < pHeight; py++) {
      for (let px = 0; px < pWidth; px++) {
        if (transformed[py][px] === 1) {
          const gx = startX + px;
          const gy = startY + py;
          this.setCell(gx, gy, 1);
        }
      }
    }
    this.recalculateStats();
  }
}
