# Sea Battle Game

A modern implementation of the classic Sea Battle (Battleship) game.

## Refactoring Changes

The original codebase has been refactored to modern JavaScript standards with the following improvements:

### 1. Modern JavaScript Features
- ES6+ syntax (classes, modules, arrow functions)
- Async/await for handling asynchronous operations
- Proper use of const/let instead of var
- Modern array methods and object features

### 2. Code Organization
- Modular structure with separate files for each component
- Clear separation of concerns:
  - `Board.js`: Handles game board logic
  - `Ship.js`: Manages ship state and behavior
  - `Player.js`: Base player functionality
  - `CPUPlayer.js`: CPU-specific logic
  - `Game.js`: Main game flow and UI
  - `index.js`: Entry point

### 3. Object-Oriented Design
- Proper class hierarchy
- Encapsulation of game state
- Clear interfaces between components
- Inheritance for CPU player

### 4. Testing
- Comprehensive unit tests for all components
- Test coverage for core game logic
- Jest testing framework
- Separate test files for each component

### 5. Error Handling
- Input validation
- Proper error messages
- Graceful error recovery

### 6. Code Quality
- Consistent code style
- Clear naming conventions
- Proper documentation
- Reduced code duplication

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Run the game:
```bash
npm start
```

3. Run tests:
```bash
npm test
```

4. Check test coverage:
```bash
npm run test:coverage
```

## Game Rules

1. The game is played on a 10x10 grid
2. Each player has 3 ships of length 3
3. Ships are placed randomly at the start of the game
4. Players take turns guessing coordinates (e.g., "00", "34")
5. 'X' marks a hit, 'O' marks a miss
6. The first player to sink all opponent's ships wins

## Project Structure

```
src/
  ├── Board.js         # Board management
  ├── Ship.js          # Ship logic
  ├── Player.js        # Base player class
  ├── CPUPlayer.js     # CPU player implementation
  ├── Game.js          # Main game logic
  └── index.js         # Entry point
```

## Testing

The project includes comprehensive unit tests for all components. Test files are located alongside their corresponding implementation files with a `.test.js` extension.

To run tests with coverage:
```bash
npm run test:coverage
```

This will generate a coverage report showing the percentage of code covered by tests. 