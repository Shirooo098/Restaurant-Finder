import { OpenAI } from "openai";
import { RestaurantCommandSchema, type RestaurantCommand } from "../schema/schema.js";

export async function interpretUserQuery(
    userQuery: string
): Promise<RestaurantCommand>{
    const prompt = `You are a restaurant search query converter. Convert user message into JSON format following this schema:
        {
            "action": "restaurant_search",
            "parameters": {
                    "query": "cuisine or restaurant",
                    "near": "location",
                    // "price": "1",
                    // "open_now": true,
                    // "rating": 4,
                    // "sort: "relevance, rating, distance or popularity"
                }
        }

        Rules: 
            - action must be exactly "restaurant_search"
            - strictly only return cuisine or restaurant
            // - price must be one of: "1", "2", "3", "4" (as strings)
            // - open_now must be boolean (true / false)
            // - sort must be one of "relevance", "rating", "distance", "popularity" (as strings)
            - exclude fields if not mentioned in the query
        Extract the following information: 
            - query: type of cuisine or restaurant
            - near: location (city, address)
            // - price: price level as strings "1" being the most affordable and "4" being the most expensive
            // - price: classify "1" as most affordable and "4" being the most expensive
            // - open_now: boolean, true if user mentions "open now" or similar
            // - sort: sort the restaurants or cuisine by relevance, rating, distance or popularity

        User Message: "${userQuery}"
        Only return valid JSON format.
    `;

    try {
        const client = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY
        });

        const apiResponse = await client.chat.completions.create({
            model: 'x-ai/grok-4.1-fast',
            messages: [{
                role: 'user' as const,
                content: prompt
            }],
        });

        const message = apiResponse.choices[0]?.message?.content;
        if(!message) {
            throw new Error("AI did not return any content")
        };

        console.log("AI prompt message:", message)

        const result = RestaurantCommandSchema.parse(JSON.parse(message));

        return result;
    } catch (error: unknown) {
        if(error instanceof Error){
            console.error("Error:", error.message);
            throw error;
        } else {
            console.error("Unexpected Error:", error)
            throw error;
        }
    }
}