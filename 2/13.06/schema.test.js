const { Schema } = require('./schema.js');

describe('StringValidator', () => {
  test('valid string', () => {
    expect(Schema.string().validate('hello').valid).toBe(true);
  });
  test('invalid type', () => {
    expect(Schema.string().validate(123).valid).toBe(false);
  });
  test('minLength', () => {
    expect(Schema.string().minLength(3).validate('hi').valid).toBe(false);
    expect(Schema.string().minLength(3).validate('hey').valid).toBe(true);
  });
  test('maxLength', () => {
    expect(Schema.string().maxLength(2).validate('hey').valid).toBe(false);
    expect(Schema.string().maxLength(3).validate('hey').valid).toBe(true);
  });
  test('pattern', () => {
    expect(Schema.string().pattern(/^\d+$/).validate('123').valid).toBe(true);
    expect(Schema.string().pattern(/^\d+$/).validate('abc').valid).toBe(false);
  });
  test('optional', () => {
    expect(Schema.string().optional().validate(undefined).valid).toBe(true);
  });
});

describe('NumberValidator', () => {
  test('valid number', () => {
    expect(Schema.number().validate(42).valid).toBe(true);
  });
  test('invalid type', () => {
    expect(Schema.number().validate('42').valid).toBe(false);
  });
  test('min', () => {
    expect(Schema.number().min(10).validate(5).valid).toBe(false);
    expect(Schema.number().min(10).validate(15).valid).toBe(true);
  });
  test('max', () => {
    expect(Schema.number().max(10).validate(15).valid).toBe(false);
    expect(Schema.number().max(10).validate(5).valid).toBe(true);
  });
  test('optional', () => {
    expect(Schema.number().optional().validate(undefined).valid).toBe(true);
  });
});

describe('BooleanValidator', () => {
  test('valid boolean', () => {
    expect(Schema.boolean().validate(true).valid).toBe(true);
    expect(Schema.boolean().validate(false).valid).toBe(true);
  });
  test('invalid type', () => {
    expect(Schema.boolean().validate('true').valid).toBe(false);
  });
  test('optional', () => {
    expect(Schema.boolean().optional().validate(undefined).valid).toBe(true);
  });
});

describe('DateValidator', () => {
  test('valid date', () => {
    expect(Schema.date().validate('2020-01-01').valid).toBe(true);
    expect(Schema.date().validate(new Date()).valid).toBe(true);
  });
  test('invalid date', () => {
    expect(Schema.date().validate('not-a-date').valid).toBe(false);
  });
  test('optional', () => {
    expect(Schema.date().optional().validate(undefined).valid).toBe(true);
  });
});

describe('ArrayValidator', () => {
  test('valid array', () => {
    expect(Schema.array(Schema.string()).validate(['a', 'b']).valid).toBe(true);
  });
  test('invalid type', () => {
    expect(Schema.array(Schema.string()).validate('not-an-array').valid).toBe(false);
  });
  test('invalid item', () => {
    expect(Schema.array(Schema.string()).validate(['a', 1]).valid).toBe(false);
  });
  test('optional', () => {
    expect(Schema.array(Schema.string()).optional().validate(undefined).valid).toBe(true);
  });
});

describe('ObjectValidator', () => {
  const schema = Schema.object({
    name: Schema.string(),
    age: Schema.number().optional(),
  });
  test('valid object', () => {
    expect(schema.validate({ name: 'Alice', age: 30 }).valid).toBe(true);
    expect(schema.validate({ name: 'Bob' }).valid).toBe(true);
  });
  test('missing required', () => {
    expect(schema.validate({ age: 30 }).valid).toBe(false);
  });
  test('invalid type', () => {
    expect(schema.validate('not-an-object').valid).toBe(false);
  });
  test('invalid field', () => {
    expect(schema.validate({ name: 123 }).valid).toBe(false);
  });
  test('optional', () => {
    expect(Schema.object({}).optional().validate(undefined).valid).toBe(true);
  });
});

describe('Nested and Complex Schemas', () => {
  const addressSchema = Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/),
    country: Schema.string()
  });
  const userSchema = Schema.object({
    id: Schema.string(),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    age: Schema.number().optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()),
    address: addressSchema.optional(),
    metadata: Schema.object({}).optional()
  });
  test('valid user', () => {
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
    expect(userSchema.validate(userData).valid).toBe(true);
  });
  test('invalid user (bad email)', () => {
    const userData = {
      id: "12345",
      name: "John Doe",
      email: "not-an-email",
      isActive: true,
      tags: ["developer", "designer"]
    };
    expect(userSchema.validate(userData).valid).toBe(false);
  });
  test('invalid user (missing required)', () => {
    const userData = {
      id: "12345",
      email: "john@example.com",
      isActive: true,
      tags: ["developer", "designer"]
    };
    expect(userSchema.validate(userData).valid).toBe(false);
  });
  test('invalid user (bad address)', () => {
    const userData = {
      id: "12345",
      name: "John Doe",
      email: "john@example.com",
      isActive: true,
      tags: ["developer", "designer"],
      address: {
        street: "123 Main St",
        city: "Anytown",
        postalCode: "abcde",
        country: "USA"
      }
    };
    expect(userSchema.validate(userData).valid).toBe(false);
  });
}); 