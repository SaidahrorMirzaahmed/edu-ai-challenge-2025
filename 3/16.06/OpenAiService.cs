using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ServiceAnalyzer;

public class OpenAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _model;
    private const string ApiEndpoint = "https://api.openai.com/v1/chat/completions";

    public OpenAiService(string apiKey, string model)
    {
        _model = model;
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
    }

    public async Task<string> GetAnalysisAsync(string prompt)
    {
        try
        {
            var requestBody = new
            {
                model = _model,
                messages = new[]
                {
                    new { role = "system", content = "You are a helpful assistant that analyzes web services and provides detailed reports." },
                    new { role = "user", content = prompt }
                },
                temperature = 0.7,
                max_tokens = 2000
            };

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody, jsonOptions),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(ApiEndpoint, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"API request failed with status {response.StatusCode}. Response: {responseContent}");
            }

            if (string.IsNullOrEmpty(responseContent))
            {
                throw new Exception("Empty response received from OpenAI API");
            }

            try
            {
                var openAiResponse = JsonSerializer.Deserialize<OpenAiResponse>(responseContent, jsonOptions);
                
                if (openAiResponse?.Choices == null || !openAiResponse.Choices.Any())
                {
                    Console.WriteLine($"Debug - Raw API Response: {responseContent}");
                    throw new Exception("No choices in OpenAI response. Check the API response format.");
                }

                var result = openAiResponse.Choices[0].Message.Content;
                if (string.IsNullOrEmpty(result))
                {
                    throw new Exception("Empty content in OpenAI response choice");
                }

                return result;
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Debug - Failed to parse response: {responseContent}");
                throw new Exception($"Failed to parse API response: {ex.Message}");
            }
        }
        catch (HttpRequestException ex)
        {
            throw new Exception($"API request failed: {ex.Message}");
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to get analysis: {ex.Message}");
        }
    }

    private class OpenAiResponse
    {
        [JsonPropertyName("choices")]
        public List<Choice> Choices { get; set; } = new();

        [JsonPropertyName("error")]
        public Error? Error { get; set; }
    }

    private class Choice
    {
        [JsonPropertyName("message")]
        public Message Message { get; set; } = new();
    }

    private class Message
    {
        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;
    }

    private class Error
    {
        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;
    }
} 