import { Player } from './Player.js';

export class CPUPlayer extends Player {
  constructor(boardSize = 10, numShips = 3, shipLength = 3) {
    super('CPU', boardSize, numShips, shipLength);
    this.mode = 'hunt';
    this.targetQueue = [];
  }

  makeGuess() {
    let guess;
    
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      guess = this.targetQueue.shift();
    } else {
      this.mode = 'hunt';
      do {
        const row = Math.floor(Math.random() * this.board.size);
        const col = Math.floor(Math.random() * this.board.size);
        guess = `${row}${col}`;
      } while (this.guesses.has(guess));
    }

    this.guesses.add(guess);
    return guess;
  }

  processHit(row, col) {
    if (this.mode === 'hunt') {
      this.mode = 'target';
    }

    // Add adjacent cells to target queue
    const adjacent = [
      { r: row - 1, c: col },
      { r: row + 1, c: col },
      { r: row, c: col - 1 },
      { r: row, c: col + 1 }
    ];

    for (const adj of adjacent) {
      if (this.board.isValidPosition(adj.r, adj.c)) {
        const guess = `${adj.r}${adj.c}`;
        if (!this.guesses.has(guess) && !this.targetQueue.includes(guess)) {
          this.targetQueue.push(guess);
        }
      }
    }
  }

  processMiss() {
    if (this.mode === 'target' && this.targetQueue.length === 0) {
      this.mode = 'hunt';
    }
  }
} 