import { Board } from './Board.js';
import { Ship } from './Ship.js';

export class Player {
  constructor(name, boardSize = 10, numShips = 3, shipLength = 3) {
    this.name = name;
    this.board = new Board(boardSize);
    this.ships = [];
    this.guesses = new Set();
    this.numShips = numShips;
    this.shipLength = shipLength;
  }

  placeShipsRandomly() {
    let placedShips = 0;
    while (placedShips < this.numShips) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const startRow = Math.floor(Math.random() * this.board.size);
      const startCol = Math.floor(Math.random() * this.board.size);
      
      const ship = new Ship(this.shipLength);
      const locations = this.generateShipLocations(startRow, startCol, orientation);
      
      if (locations && this.canPlaceShip(locations)) {
        ship.place(locations);
        this.ships.push(ship);
        this.board.placeShip(ship);
        placedShips++;
      }
    }
  }

  generateShipLocations(startRow, startCol, orientation) {
    const locations = [];
    for (let i = 0; i < this.shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      
      if (!this.board.isValidPosition(row, col)) {
        return null;
      }
      
      locations.push(`${row}${col}`);
    }
    return locations;
  }

  canPlaceShip(locations) {
    return locations.every(loc => {
      const [row, col] = loc.split('').map(Number);
      return this.board.isCellEmpty(row, col);
    });
  }

  makeGuess(row, col) {
    const guess = `${row}${col}`;
    if (this.guesses.has(guess)) {
      return { valid: false, message: 'You already guessed that location!' };
    }

    if (!this.board.isValidPosition(row, col)) {
      return { valid: false, message: 'Invalid position!' };
    }

    this.guesses.add(guess);
    return { valid: true, guess };
  }

  receiveGuess(row, col) {
    const guess = `${row}${col}`;
    for (const ship of this.ships) {
      const index = ship.locations.indexOf(guess);
      if (index !== -1) {
        ship.hit(index);
        this.board.markHit(row, col);
        return {
          hit: true,
          sunk: ship.isSunk(),
          message: ship.isSunk() ? 'Ship sunk!' : 'Hit!'
        };
      }
    }
    
    this.board.markMiss(row, col);
    return { hit: false, message: 'Miss!' };
  }

  hasLost() {
    return this.ships.every(ship => ship.isSunk());
  }
} 