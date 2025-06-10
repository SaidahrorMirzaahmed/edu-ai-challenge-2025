const { Enigma } = require('./enigma');

describe('Enigma Machine', () => {
  // Helper function to create an Enigma instance with default settings
  const createDefaultEnigma = () => {
    return new Enigma(
      [0, 1, 2], // Rotor IDs (I, II, III)
      [0, 0, 0], // Rotor positions (A, A, A)
      [0, 0, 0], // Ring settings
      [] // No plugboard pairs
    );
  };

  test('should return original message when encrypting twice with same settings', () => {
    const message = 'HELLO WORLD';
    
    // First encryption
    const enigma1 = createDefaultEnigma();
    const encrypted = enigma1.process(message);
    
    // Second encryption (should return to original)
    const enigma2 = createDefaultEnigma();
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(message);
  });

  test('should handle different rotor positions', () => {
    const message = 'TEST MESSAGE';
    const rotorPositions = [1, 2, 3];
    
    const enigma1 = new Enigma(
      [0, 1, 2],
      rotorPositions,
      [0, 0, 0],
      []
    );
    const encrypted = enigma1.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      rotorPositions,
      [0, 0, 0],
      []
    );
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(message);
  });

  test('should handle different ring settings', () => {
    const message = 'RING SETTINGS TEST';
    const ringSettings = [1, 2, 3];
    
    const enigma1 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      ringSettings,
      []
    );
    const encrypted = enigma1.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      ringSettings,
      []
    );
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(message);
  });

  test('should handle plugboard pairs', () => {
    const message = 'ABCDEF';
    const plugPairs = [['A', 'B'], ['C', 'D']];
    
    const enigma1 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      plugPairs
    );
    const encrypted = enigma1.process(message);
    console.log('Original message:', message);
    console.log('Encrypted:', encrypted);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      plugPairs
    );
    const decrypted = enigma2.process(encrypted);
    console.log('Decrypted:', decrypted);
    
    // Test each character individually to see where the issue might be
    for (let i = 0; i < message.length; i++) {
      const originalChar = message[i];
      const encryptedChar = encrypted[i];
      const decryptedChar = decrypted[i];
      console.log(`Character ${i}: ${originalChar} -> ${encryptedChar} -> ${decryptedChar}`);
    }
    
    expect(decrypted).toBe(message);
  });

  test('should handle special characters and spaces', () => {
    const message = 'HELLO, WORLD! 123';
    
    const enigma1 = createDefaultEnigma();
    const encrypted = enigma1.process(message);
    
    const enigma2 = createDefaultEnigma();
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(message);
  });

  test('should handle empty string', () => {
    const message = '';
    
    const enigma1 = createDefaultEnigma();
    const encrypted = enigma1.process(message);
    
    const enigma2 = createDefaultEnigma();
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(message);
  });

  test('should handle case sensitivity', () => {
    const message = 'Hello World';
    
    const enigma1 = createDefaultEnigma();
    const encrypted = enigma1.process(message);
    
    const enigma2 = createDefaultEnigma();
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(message.toUpperCase());
  });
}); 