import { Player } from '../Player.js';
import { Ship } from '../Ship.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('TestPlayer', 10, 3, 3);
  });

  test('should create a player with correct properties', () => {
    expect(player.name).toBe('TestPlayer');
    expect(player.board.size).toBe(10);
    expect(player.numShips).toBe(3);
    expect(player.shipLength).toBe(3);
    expect(player.ships.length).toBe(0);
    expect(player.guesses.size).toBe(0);
  });

  test('should place ships randomly', () => {
    player.placeShipsRandomly();
    expect(player.ships.length).toBe(3);
    expect(player.ships[0].length).toBe(3);
  });

  test('should validate ship placement', () => {
    // Valid locations (adjacent cells)
    const validLocations = ['00', '01', '02'];
    // Invalid locations (non-adjacent cells)
    const invalidLocations = ['00', '01', '10'];
    
    // First place a ship to block some cells
    const ship = new Ship(3);
    ship.place(['00', '01', '02']);
    player.ships.push(ship);
    player.board.placeShip(ship);
    
    expect(player.canPlaceShip(validLocations)).toBe(false); // Should be false because cells are occupied
    expect(player.canPlaceShip(invalidLocations)).toBe(false); // Should be false because cells are not adjacent
  });

  test('should make valid guesses', () => {
    const result = player.makeGuess(5, 5);
    expect(result.valid).toBe(true);
    expect(player.guesses.has('55')).toBe(true);
  });

  test('should reject invalid guesses', () => {
    // Test out of bounds
    expect(player.makeGuess(10, 5).valid).toBe(false);
    expect(player.makeGuess(5, 10).valid).toBe(false);
    expect(player.makeGuess(-1, 5).valid).toBe(false);
    expect(player.makeGuess(5, -1).valid).toBe(false);

    // Test duplicate guess
    player.makeGuess(5, 5);
    expect(player.makeGuess(5, 5).valid).toBe(false);
  });

  test('should process received guesses correctly', () => {
    // Create and place a ship
    const ship = new Ship(3);
    ship.place(['00', '01', '02']);
    player.ships.push(ship);
    player.board.placeShip(ship);

    // Test hit
    const hitResult = player.receiveGuess(0, 0);
    expect(hitResult.hit).toBe(true);
    expect(hitResult.sunk).toBe(false);
    expect(player.board.getCell(0, 0)).toBe('X');

    // Test miss
    const missResult = player.receiveGuess(5, 5);
    expect(missResult.hit).toBe(false);
    expect(player.board.getCell(5, 5)).toBe('O');
  });

  test('should detect when player has lost', () => {
    // Create and place a ship
    const ship = new Ship(3);
    ship.place(['00', '01', '02']);
    player.ships.push(ship);
    player.board.placeShip(ship);

    expect(player.hasLost()).toBe(false);
    
    ship.hit(0);
    ship.hit(1);
    ship.hit(2);
    
    expect(player.hasLost()).toBe(true);
  });
}); 