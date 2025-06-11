import { Ship } from './Ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test('should create a ship with correct length', () => {
    expect(ship.length).toBe(3);
    expect(ship.hits.length).toBe(3);
    expect(ship.locations.length).toBe(0);
  });

  test('should place ship correctly', () => {
    const locations = ['00', '01', '02'];
    ship.place(locations);
    expect(ship.locations).toEqual(locations);
  });

  test('should mark hits correctly', () => {
    ship.place(['00', '01', '02']);
    ship.hit(0);
    expect(ship.hits[0]).toBe('hit');
    expect(ship.hits[1]).toBe('');
    expect(ship.hits[2]).toBe('');
  });

  test('should detect when ship is sunk', () => {
    ship.place(['00', '01', '02']);
    expect(ship.isSunk()).toBe(false);
    
    ship.hit(0);
    expect(ship.isSunk()).toBe(false);
    
    ship.hit(1);
    expect(ship.isSunk()).toBe(false);
    
    ship.hit(2);
    expect(ship.isSunk()).toBe(true);
  });

  test('should get hit locations correctly', () => {
    ship.place(['00', '01', '02']);
    ship.hit(0);
    ship.hit(2);
    expect(ship.getHitLocations()).toEqual(['00', '02']);
  });
}); 