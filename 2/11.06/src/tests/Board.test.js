import { Board } from '../Board.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(10);
  });

  test('should create a board with correct size', () => {
    expect(board.size).toBe(10);
    expect(board.grid.length).toBe(10);
    expect(board.grid[0].length).toBe(10);
  });

  test('should initialize with empty cells', () => {
    for (let i = 0; i < board.size; i++) {
      for (let j = 0; j < board.size; j++) {
        expect(board.getCell(i, j)).toBe('~');
      }
    }
  });

  test('should mark hit correctly', () => {
    board.markHit(5, 5);
    expect(board.getCell(5, 5)).toBe('X');
  });

  test('should mark miss correctly', () => {
    board.markMiss(5, 5);
    expect(board.getCell(5, 5)).toBe('O');
  });

  test('should validate positions correctly', () => {
    expect(board.isValidPosition(0, 0)).toBe(true);
    expect(board.isValidPosition(9, 9)).toBe(true);
    expect(board.isValidPosition(-1, 0)).toBe(false);
    expect(board.isValidPosition(0, -1)).toBe(false);
    expect(board.isValidPosition(10, 0)).toBe(false);
    expect(board.isValidPosition(0, 10)).toBe(false);
  });

  test('should check if cell is empty', () => {
    expect(board.isCellEmpty(5, 5)).toBe(true);
    board.markHit(5, 5);
    expect(board.isCellEmpty(5, 5)).toBe(false);
  });
}); 