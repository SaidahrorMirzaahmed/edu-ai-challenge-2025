I'll summarize the bug and its fix in the Enigma machine implementation:

**The Bug:**
The Enigma machine's encryption wasn't symmetric when using the plugboard. This meant that if you encrypted a message and then encrypted it again with the same settings, you wouldn't get back the original message. This was happening because the plugboard swap was only being applied once during the encryption process.

**Where it was:**
In the `encryptChar` method of the Enigma class, the plugboard swap was only being applied at the beginning of the encryption process:
```javascript
encryptChar(c) {
    // ...
    c = plugboardSwap(c, this.plugboardPairs);  // Only applied once
    // ... rotors and reflector operations ...
    return c;  // No second plugboard swap
}
```

**Why it was wrong:**
In the real Enigma machine, the plugboard connections are applied both at the beginning and end of the encryption process for each character. This double application is necessary for the encryption to be symmetric. Without the second plugboard swap, the encryption process wasn't properly reversible.

**The Fix:**
I modified the `encryptChar` method to apply the plugboard swap both before and after the rotor/reflector operations:
```javascript
encryptChar(c) {
    // ...
    // First plugboard swap
    c = plugboardSwap(c, this.plugboardPairs);
    
    // Forward through rotors
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      c = this.rotors[i].forward(c);
    }

    // Reflector
    c = REFLECTOR[alphabet.indexOf(c)];

    // Backward through rotors
    for (let i = 0; i < this.rotors.length; i++) {
      c = this.rotors[i].backward(c);
    }

    // Second plugboard swap
    c = plugboardSwap(c, this.plugboardPairs);

    return c;
}
```

**Why the fix works:**
1. When encrypting a character that's part of a plugboard pair (e.g., 'A' with pair 'AB'):
   - First swap: 'A' → 'B'
   - After rotors/reflector: 'B' → some other character
   - Second swap: that character → final encrypted character

2. When decrypting (which is the same as encrypting again):
   - The same process happens in reverse
   - The double plugboard swap ensures the original character is recovered

This fix makes the Enigma machine's encryption properly symmetric, which is a key property of the machine - encrypting twice with the same settings should return the original message.