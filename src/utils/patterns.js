/**
 * Pattern Preset Library for Conway's Game of Life
 * Represented as 2D Arrays (1 = Alive, 0 = Dead)
 */

export const PATTERNS = [
  // --- Spaceships ---
  {
    id: 'glider',
    name: 'Glider',
    category: 'Spaceships',
    description: 'The smallest, most famous diagonal spaceship.',
    matrix: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ]
  },
  {
    id: 'lwss',
    name: 'Lightweight Spaceship (LWSS)',
    category: 'Spaceships',
    description: 'Orthogonal spaceship traveling at speed c/2.',
    matrix: [
      [0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0]
    ]
  },
  {
    id: 'mwss',
    name: 'Middleweight Spaceship (MWSS)',
    category: 'Spaceships',
    description: 'Medium orthogonal spaceship.',
    matrix: [
      [0, 0, 1, 0, 0, 0],
      [1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 1, 1]
    ]
  },

  // --- Guns & Generators ---
  {
    id: 'gosper_gun',
    name: 'Gosper Glider Gun',
    category: 'Guns',
    description: 'The first known gun, continuously spawning gliders.',
    matrix: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  },

  // --- Oscillators ---
  {
    id: 'blinker',
    name: 'Blinker',
    category: 'Oscillators',
    description: 'Period 2 oscillator.',
    matrix: [
      [1, 1, 1]
    ]
  },
  {
    id: 'toad',
    name: 'Toad',
    category: 'Oscillators',
    description: 'Period 2 oscillator.',
    matrix: [
      [0, 1, 1, 1],
      [1, 1, 1, 0]
    ]
  },
  {
    id: 'pulsar',
    name: 'Pulsar',
    category: 'Oscillators',
    description: 'Large period 3 oscillator with elegant symmetry.',
    matrix: [
      [0,0,1,1,1,0,0,0,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [0,0,1,1,1,0,0,0,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,0,0,0,1,1,1,0,0],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,0,0,0,1,1,1,0,0]
    ]
  },
  {
    id: 'pentadecathlon',
    name: 'Pentadecathlon',
    category: 'Oscillators',
    description: 'Period 15 oscillator.',
    matrix: [
      [1,1,1,1,1,1,1,1,1,1]
    ]
  },

  // --- Methuselahs ---
  {
    id: 'acorn',
    name: 'Acorn',
    category: 'Methuselahs',
    description: 'Takes 5,206 generations to stabilize, generating 13 gliders.',
    matrix: [
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 0, 1, 1, 1]
    ]
  },
  {
    id: 'r_pentomino',
    name: 'R-Pentomino',
    category: 'Methuselahs',
    description: 'Classic chaos generator running over 1,100 generations.',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0]
    ]
  },
  {
    id: 'diehard',
    name: 'Diehard',
    category: 'Methuselahs',
    description: 'Disappears completely after 130 generations.',
    matrix: [
      [0, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 1, 1]
    ]
  }
];
