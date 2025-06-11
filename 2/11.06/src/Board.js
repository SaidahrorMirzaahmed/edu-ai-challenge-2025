export class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = Array(size).fill().map(() => Array(size).fill('~'));
  }

  placeShip(ship) {
    for (const location of ship.locations) {
      const [row, col] = location.split('').map(Number);
      this.grid[row][col] = 'S';
    }
  }

  markHit(row, col) {
    this.grid[row][col] = 'X';
  }

  markMiss(row, col) {
    this.grid[row][col] = 'O';
  }

  getCell(row, col) {
    return this.grid[row][col];
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  isCellEmpty(row, col) {
    return this.grid[row][col] === '~';
  }

  toString() {
    let result = '  ';
    // Add column numbers
    for (let i = 0; i < this.size; i++) {
      result += i + ' ';
    }
    result += '\n';

    // Add rows with row numbers
    for (let i = 0; i < this.size; i++) {
      result += i + ' ' + this.grid[i].join(' ') + '\n';
    }
    return result;
  }
} 