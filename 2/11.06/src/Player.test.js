import { Player } from './Player.js';

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
    const validLocations = ['00', '01', '02'];
    const invalidLocations = ['00', '01', '10']; // Not adjacent
    
    expect(player.canPlaceShip(validLocations)).toBe(true);
    expect(player.canPlaceShip(invalidLocations)).toBe(false);
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
    // Place a ship
    const ship = player.ships[0];
    ship.place(['00', '01', '02']);
    player.ships.push(ship);

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
    // Place and sink all ships
    const ship = player.ships[0];
    ship.place(['00', '01', '02']);
    player.ships.push(ship);

    expect(player.hasLost()).toBe(false);
    
    ship.hit(0);
    ship.hit(1);
    ship.hit(2);
    
    expect(player.hasLost()).toBe(true);
  });
}); 