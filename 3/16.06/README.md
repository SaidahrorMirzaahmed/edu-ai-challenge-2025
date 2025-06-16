# Service Analyzer

A .NET console application that analyzes web services using OpenAI's GPT model to generate detailed reports.

## Features

- Interactive console interface
- OpenAI GPT integration for service analysis
- Structured markdown report generation
- Report saving functionality
- Error handling and validation

## Prerequisites

- .NET 6.0 SDK or later
- OpenAI API key

## Setup

1. Clone the repository
2. Create an `appsettings.json` file with your OpenAI API key:
   ```json
   {
     "OpenAI": {
       "ApiKey": "your-api-key-here",
       "Model": "gpt-4"
     }
   }
   ```
3. Build the project:
   ```bash
   dotnet build
   ```

## Usage

1. Run the application:
   ```bash
   dotnet run
   ```

2. Enter the name or description of the service you want to analyze when prompted.

3. Wait for the analysis to complete. The application will:
   - Generate a structured prompt
   - Send it to OpenAI
   - Display the analysis
   - Offer to save the report

4. If you choose to save the report, it will be saved as a markdown file with a timestamp.

## Report Structure

The generated report includes:
- Brief History
- Target Audience
- Core Features
- Unique Selling Points
- Business Model
- Tech Stack Insights
- Perceived Strengths
- Perceived Weaknesses

## Error Handling

The application includes comprehensive error handling for:
- Invalid user input
- API communication issues
- File system operations
- Configuration problems

## Configuration

The application can be configured through `appsettings.json`:
- OpenAI API key
- Model selection
- Other settings as needed

## Security

- API keys are stored in configuration
- Sensitive files are gitignored
- Input validation is implemented

## License

MIT License 