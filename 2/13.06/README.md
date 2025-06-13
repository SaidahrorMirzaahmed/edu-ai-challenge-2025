# Data Validation Library

A reusable JavaScript library for validating complex data structures, including strings, numbers, booleans, dates, arrays, and nested objects.

## Features
- Type-safe validation for primitive and complex types
- Support for optional fields
- Custom error messages
- Nested and array schemas

## Installation

Clone this repository or copy the `schema.js` file into your project.

## Usage

Import or require the `schema.js` file in your project:

```js
const { Schema } = require('./schema.js');
```

### Example: Define and Validate a User Schema

```js
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
console.log(result);
```

## Running Tests

This project uses [Jest](https://jestjs.io/) for testing.

1. Install Jest (if not already installed):
   ```bash
   npm install --save-dev jest
   ```
2. Run the tests:
   ```bash
   npx jest schema.test.js
   ```

## Test Coverage

A test coverage report is provided in `test_report.txt`.

## License

MIT 