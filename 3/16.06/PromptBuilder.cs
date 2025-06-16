namespace ServiceAnalyzer;

public class PromptBuilder
{
    public string BuildPrompt(string input)
    {
        return $@"Please analyze the following service/description and provide a detailed markdown-formatted report:

Input: {input}

Please structure your response with the following sections:

# Brief History
[Provide a concise history of the service or concept]

# Target Audience
[Describe the primary and secondary target users]

# Core Features
[List and explain the main features]

# Unique Selling Points
[Highlight what makes this service stand out]

# Business Model
[Explain how the service generates revenue]

# Tech Stack Insights
[Describe the likely technology stack and architecture]

# Perceived Strengths
[Analyze the main advantages]

# Perceived Weaknesses
[Identify potential challenges and limitations]

Please ensure your response is in markdown format and provides specific, actionable insights.";
    }
} 