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
                }
        }

        Rules: 
            - action must be exactly "restaurant_search"
            - strictly only return cuisine or restaurant
            - exclude fields if not mentioned in the query
        Extract the following information: 
            - query: type of cuisine or restaurant
            - near: location (city, address)
           
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
                role: 'user',
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