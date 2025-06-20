# ProductSearchAI

A C# console application that uses OpenAI's function calling to filter products based on natural language user input.

## Features

- **Natural Language Processing**: Accepts user preferences in plain English
- **OpenAI Integration**: Uses GPT models for intelligent product filtering
- **JSON Data Processing**: Works with structured product datasets
- **Function Calling**: Leverages OpenAI's function calling API for structured responses
- **Clean Output**: Displays filtered products in a readable format

## Prerequisites

- .NET 8.0 SDK or later
- OpenAI API key with access to GPT models
- JSON file containing product data

## Installation

1. **Clone or download the project files**

2. **Install required NuGet packages**:
   ```bash
   dotnet restore
   ```

3. **Set up your OpenAI API key**:
   
   Edit the `appsettings.json` file and replace `"your-api-key-here"` with your actual OpenAI API key:
   ```json
   {
     "OpenAI": {
       "ApiKey": "sk-your-actual-openai-api-key-here",
       "Model": "gpt-4"
     }
   }
   ```
   
   **Important**: 
   - Never commit your API key to version control
   - The `appsettings.json` file should be added to `.gitignore`
   - Keep your API key secure and private

## Usage

1. **Build the project**:
   ```bash
   dotnet build
   ```

2. **Run the application**:
   ```bash
   dotnet run
   ```

3. **Enter your product preferences** when prompted:
   ```
   Describe your product preferences (e.g., 'under $200 and highly rated'):
   I want electronics under $500 with good ratings
   ```

4. **View the filtered results**:
   The application will display products that match your criteria.

## Configuration

### OpenAI API Key Setup

To add your OpenAI API key to the application:

1. **Get your API key**:
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Navigate to API Keys section
   - Create a new API key

2. **Update appsettings.json**:
   ```json
   {
     "OpenAI": {
       "ApiKey": "sk-your-actual-api-key-here",
       "Model": "gpt-4"
     }
   }
   ```

3. **Security best practices**:
   - Use environment variables in production
   - Never share your API key
   - Monitor your API usage and costs
   - Consider using Azure Key Vault or similar services for enterprise applications

### Model Configuration

You can change the GPT model in `appsettings.json`:
- `"gpt-4"` - Most capable, higher cost
- `"gpt-3.5-turbo"` - Good balance of capability and cost
- `"gpt-4-turbo"` - Latest model with improved performance

## Project Structure

```
ProductSearchAI/
├── Program.cs              # Main application logic
├── appsettings.json        # Configuration file
├── products.json           # Sample product data
├── filter_products.schema.json  # Function schema
└── README.md              # This file
```

## Sample Output

```
Describe your product preferences (e.g., 'under $200 and highly rated'):
electronics under $500

Filtered Products:
- Wireless Headphones | $149.99 | Rating: 4.7 | Category: Electronics | In Stock: True
- Smartphone | $699.99 | Rating: 4.8 | Category: Electronics | In Stock: True
```

## Error Handling

The application includes error handling for:
- Missing or invalid API keys
- Network connectivity issues
- Invalid JSON responses
- File not found errors

## Troubleshooting

### Common Issues:

1. **"OpenAI API key not found in appsettings.json"**
   - Ensure you've updated the `ApiKey` field in `appsettings.json`
   - Check that the JSON syntax is valid
   - Verify the file is in the correct location

2. **"API request failed"**
   - Check your internet connection
   - Verify your API key is valid and has sufficient credits
   - Ensure you have access to the specified model

3. **"No products matched your criteria"**
   - Try different search terms
   - Check that your `products.json` file contains relevant data
   - Ensure your preferences are clear and specific

## API Usage

This application uses:
- **OpenAI Chat Completions API** for natural language processing
- **Function calling** for structured data extraction
- API calls are billed according to OpenAI's pricing

## Security Notes

- Keep your API key secure and never commit it to version control
- Consider using environment variables for production deployments
- Monitor your API usage to control costs
- Use appropriate access controls for your API keys

## License

This project is provided as-is for educational and development purposes.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application. 