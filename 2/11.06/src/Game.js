import { Player } from './Player.js';
import { CPUPlayer } from './CPUPlayer.js';
import readline from 'readline';

export class Game {
  constructor(boardSize = 10, numShips = 3, shipLength = 3) {
    this.boardSize = boardSize;
    this.numShips = numShips;
    this.shipLength = shipLength;
    this.player = new Player('Player', boardSize, numShips, shipLength);
    this.cpu = new CPUPlayer(boardSize, numShips, shipLength);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start() {
    console.log("\nLet's play Sea Battle!");
    console.log(`Try to sink the ${this.numShips} enemy ships.`);

    this.player.placeShipsRandomly();
    this.cpu.placeShipsRandomly();

    await this.gameLoop();
  }

  printBoards() {
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    const header = '  ' + Array(this.boardSize).fill().map((_, i) => i).join(' ');
    console.log(header + '     ' + header);

    for (let i = 0; i < this.boardSize; i++) {
      let rowStr = i + ' ';
      for (let j = 0; j < this.boardSize; j++) {
        rowStr += this.cpu.board.getCell(i, j) + ' ';
      }
      rowStr += '    ' + i + ' ';
      for (let j = 0; j < this.boardSize; j++) {
        rowStr += this.player.board.getCell(i, j) + ' ';
      }
      console.log(rowStr);
    }
    console.log('\n');
  }

  async processPlayerGuess(guess) {
    const [row, col] = guess.split('').map(Number);
    const result = this.player.makeGuess(row, col);
    
    if (!result.valid) {
      console.log(result.message);
      return false;
    }

    const cpuResult = this.cpu.receiveGuess(row, col);
    console.log(cpuResult.message);
    
    if (cpuResult.sunk) {
      console.log('You sunk an enemy battleship!');
    }

    return true;
  }

  async processCPUTurn() {
    console.log("\n--- CPU's Turn ---");
    const guess = this.cpu.makeGuess();
    const [row, col] = guess.split('').map(Number);
    
    const result = this.player.receiveGuess(row, col);
    console.log(`CPU guessed ${guess}: ${result.message}`);
    
    if (result.hit) {
      this.cpu.processHit(row, col);
      if (result.sunk) {
        console.log('CPU sunk your battleship!');
      }
    } else {
      this.cpu.processMiss();
    }
  }

  async gameLoop() {
    if (this.cpu.hasLost()) {
      console.log('\n*** CONGRATULATIONS! You sunk all enemy battleships! ***');
      this.printBoards();
      this.rl.close();
      return;
    }

    if (this.player.hasLost()) {
      console.log('\n*** GAME OVER! The CPU sunk all your battleships! ***');
      this.printBoards();
      this.rl.close();
      return;
    }

    this.printBoards();

    const answer = await new Promise(resolve => {
      this.rl.question('Enter your guess (e.g., 00): ', resolve);
    });

    const playerGuessed = await this.processPlayerGuess(answer);

    if (playerGuessed) {
      if (this.cpu.hasLost()) {
        await this.gameLoop();
        return;
      }

      await this.processCPUTurn();

      if (this.player.hasLost()) {
        await this.gameLoop();
        return;
      }
    }

    await this.gameLoop();
  }
} 