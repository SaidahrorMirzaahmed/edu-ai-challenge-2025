// --- Data Validation Library ---
// Core Validator base class
class Validator {
  constructor() {
    this._isOptional = false;
    this._message = null;
  }
  optional() {
    this._isOptional = true;
    return this;
  }
  withMessage(msg) {
    this._message = msg;
    return this;
  }
  // To be implemented by subclasses
  validate(value) {
    throw new Error('validate() not implemented');
  }
}

// String Validator
class StringValidator extends Validator {
  constructor() {
    super();
    this._min = null;
    this._max = null;
    this._pattern = null;
  }
  minLength(n) {
    this._min = n;
    return this;
  }
  maxLength(n) {
    this._max = n;
    return this;
  }
  pattern(regex) {
    this._pattern = regex;
    return this;
  }
  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true };
      return { valid: false, message: this._message || 'Required string' };
    }
    if (typeof value !== 'string') return { valid: false, message: this._message || 'Not a string' };
    if (this._min !== null && value.length < this._min) return { valid: false, message: this._message || `Min length ${this._min}` };
    if (this._max !== null && value.length > this._max) return { valid: false, message: this._message || `Max length ${this._max}` };
    if (this._pattern && !this._pattern.test(value)) return { valid: false, message: this._message || 'Pattern mismatch' };
    return { valid: true };
  }
}

// Number Validator
class NumberValidator extends Validator {
  constructor() {
    super();
    this._min = null;
    this._max = null;
  }
  min(n) {
    this._min = n;
    return this;
  }
  max(n) {
    this._max = n;
    return this;
  }
  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true };
      return { valid: false, message: this._message || 'Required number' };
    }
    if (typeof value !== 'number' || isNaN(value)) return { valid: false, message: this._message || 'Not a number' };
    if (this._min !== null && value < this._min) return { valid: false, message: this._message || `Min value ${this._min}` };
    if (this._max !== null && value > this._max) return { valid: false, message: this._message || `Max value ${this._max}` };
    return { valid: true };
  }
}

// Boolean Validator
class BooleanValidator extends Validator {
  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true };
      return { valid: false, message: this._message || 'Required boolean' };
    }
    if (typeof value !== 'boolean') return { valid: false, message: this._message || 'Not a boolean' };
    return { valid: true };
  }
}

// Date Validator
class DateValidator extends Validator {
  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true };
      return { valid: false, message: this._message || 'Required date' };
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) return { valid: false, message: this._message || 'Not a valid date' };
    return { valid: true };
  }
}

// Array Validator
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this._itemValidator = itemValidator;
  }
  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true };
      return { valid: false, message: this._message || 'Required array' };
    }
    if (!Array.isArray(value)) return { valid: false, message: this._message || 'Not an array' };
    for (let i = 0; i < value.length; i++) {
      const res = this._itemValidator.validate(value[i]);
      if (!res.valid) return { valid: false, message: `Item ${i}: ${res.message}` };
    }
    return { valid: true };
  }
}

// Object Validator
class ObjectValidator extends Validator {
  constructor(schema) {
    super();
    this._schema = schema;
  }
  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true };
      return { valid: false, message: this._message || 'Required object' };
    }
    if (typeof value !== 'object' || Array.isArray(value)) return { valid: false, message: this._message || 'Not an object' };
    for (const key in this._schema) {
      const validator = this._schema[key];
      const res = validator.validate(value[key]);
      if (!res.valid) return { valid: false, message: `Field '${key}': ${res.message}` };
    }
    return { valid: true };
  }
}

// Schema Builder
class Schema {
  static string() { return new StringValidator(); }
  static number() { return new NumberValidator(); }
  static boolean() { return new BooleanValidator(); }
  static date() { return new DateValidator(); }
  static object(schema) { return new ObjectValidator(schema); }
  static array(itemValidator) { return new ArrayValidator(itemValidator); }
}

// --- Usage Example ---
// Define a complex schema
const addressSchema = Schema.object({
  street: Schema.string(),
  city: Schema.string(),
  postalCode: Schema.string().pattern(/^\d{5}$/).withMessage('Postal code must be 5 digits'),
  country: Schema.string()
});

const userSchema = Schema.object({
  id: Schema.string().withMessage('ID must be a string'),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()),
  address: addressSchema.optional(),
  metadata: Schema.object({}).optional()
});

// Validate data
const userData = {
  id: "12345",
  name: "John Doe",
  email: "john@example.com",
  isActive: true,
  tags: ["developer", "designer"],
  address: {
    street: "123 Main St",
    city: "Anytown",
    postalCode: "12345",
    country: "USA"
  }
};

const result = userSchema.validate(userData);
console.log('Validation result:', result);

module.exports = { Schema };
  
