using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ServiceAnalyzer;

class Program
{
    static async Task Main(string[] args)
    {
        try
        {
            var host = CreateHostBuilder(args).Build();
            var configuration = host.Services.GetRequiredService<IConfiguration>();
            
            var apiKey = configuration["OpenAI:ApiKey"];
            var model = configuration["OpenAI:Model"];

            if (string.IsNullOrEmpty(apiKey))
            {
                Console.WriteLine("Error: OpenAI API key not found in configuration.");
                return;
            }

            var promptBuilder = new PromptBuilder();
            var openAiService = new OpenAiService(apiKey, model);

            Console.WriteLine("Welcome to Service Analyzer!");
            Console.WriteLine("Enter the name or description of the service you want to analyze:");
            var input = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(input))
            {
                Console.WriteLine("Error: Input cannot be empty.");
                return;
            }

            Console.WriteLine("\nAnalyzing service...");
            var prompt = promptBuilder.BuildPrompt(input);
            var analysis = await openAiService.GetAnalysisAsync(prompt);

            Console.WriteLine("\nAnalysis Results:");
            Console.WriteLine(analysis);

            Console.WriteLine("\nWould you like to save this analysis to a file? (y/n)");
            var saveResponse = Console.ReadLine()?.ToLower();

            if (saveResponse == "y")
            {
                var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
                var filename = $"analysis_{timestamp}.md";
                await File.WriteAllTextAsync(filename, analysis);
                Console.WriteLine($"\nAnalysis saved to {filename}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\nError: {ex.Message}");
        }
    }

    private static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostContext, config) =>
            {
                config.SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            });
} 