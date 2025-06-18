using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;

namespace ProductSearchAI
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Set your OpenAI API key and model here
            string apiKey = "your-api-key-here"; // <-- PUT YOUR KEY HERE
            string model = "gpt-4";

            if (string.IsNullOrEmpty(apiKey) || apiKey == "your-api-key-here")
            {
                Console.WriteLine("OpenAI API key not set in code. Please set your API key in the source.");
                return;
            }

            // 1. Read user preferences
            Console.WriteLine("Describe your product preferences (e.g., 'under $200 and highly rated'):");
            string userInput = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(userInput))
            {
                Console.WriteLine("No input provided. Exiting.");
                return;
            }

            // 2. Load products.json
            string productsPath = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "products.json"));
            if (!File.Exists(productsPath))
            {
                Console.WriteLine($"Could not find products.json at {productsPath}");
                return;
            }
            var productsJson = await File.ReadAllTextAsync(productsPath);

            // 3. Prepare function schema
            var functionSchema = new
            {
                name = "filter_products",
                description = "Filter products by category, price, rating, and stock",
                parameters = new
                {
                    type = "object",
                    properties = new
                    {
                        category = new { type = "string", description = "Desired category (e.g., Electronics)" },
                        max_price = new { type = "number", description = "Maximum price user is willing to pay" },
                        min_rating = new { type = "number", description = "Minimum acceptable rating" },
                        in_stock = new { type = "boolean", description = "Whether the item must be in stock" }
                    },
                    required = new string[] { }
                }
            };

            // 4. Prepare the request payload
            var payload = new
            {
                model = model,
                messages = new object[]
                {
                    new { role = "system", content = "You are a product search assistant. Given a list of products and user preferences, return only the filtered products as a JSON array." },
                    new { role = "user", content = $"User preferences: {userInput}\nProducts: {productsJson}" }
                },
                max_tokens = 1000
            };

            // 5. Call OpenAI API
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var requestContent = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync("https://api.openai.com/v1/chat/completions", requestContent);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"OpenAI API call failed: {response.StatusCode}");
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine(error);
                return;
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var responseJson = JObject.Parse(responseString);

            // 6. Extract the assistant's message content
            var message = responseJson["choices"]?[0]?["message"];
            var content = message?["content"]?.ToString();

            if (string.IsNullOrWhiteSpace(content))
            {
                Console.WriteLine("No content returned by the model.");
                Console.WriteLine("Raw response: " + responseString);
                return;
            }

            // 7. Display the filtered products (as returned by OpenAI)
            try
            {
                var filteredProducts = JArray.Parse(content);
                if (filteredProducts.Count == 0)
                {
                    Console.WriteLine("No products matched your criteria.");
                }
                else
                {
                    Console.WriteLine("Filtered Products:");
                    foreach (var product in filteredProducts)
                    {
                        Console.WriteLine($"- {product["name"]} | ${product["price"]} | Rating: {product["rating"]} | Category: {product["category"]} | In Stock: {product["in_stock"]}");
                    }
                }
            }
            catch
            {
                Console.WriteLine("Could not parse filtered products from OpenAI response. Raw content:");
                Console.WriteLine(content);
            }
        }
    }
}
