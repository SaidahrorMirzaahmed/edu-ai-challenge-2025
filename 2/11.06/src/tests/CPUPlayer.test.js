import { CPUPlayer } from '../CPUPlayer.js';

describe('CPUPlayer', () => {
  let cpu;

  beforeEach(() => {
    cpu = new CPUPlayer(10, 3, 3);
  });

  test('should create CPU player with correct properties', () => {
    expect(cpu.name).toBe('CPU');
    expect(cpu.mode).toBe('hunt');
    expect(cpu.targetQueue).toEqual([]);
  });

  test('should make random guesses in hunt mode', () => {
    const guess = cpu.makeGuess();
    expect(guess.length).toBe(2);
    expect(cpu.guesses.has(guess)).toBe(true);
  });

  test('should switch to target mode after hit', () => {
    cpu.processHit(5, 5);
    expect(cpu.mode).toBe('target');
    expect(cpu.targetQueue.length).toBe(4); // Should add 4 adjacent cells
  });

  test('should add adjacent cells to target queue after hit', () => {
    cpu.processHit(5, 5);
    const expectedTargets = ['45', '65', '54', '56'];
    expect(cpu.targetQueue.sort()).toEqual(expectedTargets.sort());
  });

  test('should not add invalid positions to target queue', () => {
    cpu.processHit(0, 0);
    const expectedTargets = ['10', '01'];
    expect(cpu.targetQueue.sort()).toEqual(expectedTargets.sort());
  });

  test('should switch back to hunt mode when target queue is empty', () => {
    cpu.mode = 'target';
    cpu.processMiss();
    expect(cpu.mode).toBe('hunt');
  });

  test('should not add duplicate positions to target queue', () => {
    cpu.processHit(5, 5);
    const initialQueueLength = cpu.targetQueue.length;
    cpu.processHit(5, 5);
    expect(cpu.targetQueue.length).toBe(initialQueueLength);
  });

  test('should make guesses from target queue in target mode', () => {
    cpu.mode = 'target';
    cpu.targetQueue = ['55', '56', '57'];
    
    const guess = cpu.makeGuess();
    // The guess should be one of the target queue values
    expect(['55', '56', '57']).toContain(guess);
    expect(cpu.guesses.has(guess)).toBe(true);
  });
}); 