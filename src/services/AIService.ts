
import { GoogleGenAI } from "@google/genai";
import { RestaurantCommandSchema, type RestaurantCommand } from "../schema/schema.js";
import { zodToJsonSchema } from "zod-to-json-schema";


const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY!});

export async function interpretUserQuery(
    userQuery: string
): Promise<RestaurantCommand>{
    const prompt = `You are a restaurant search query converter. Convert user message into JSON format following this schema:
        {
            "action": "restaurant_search",
            "parameters": {
                    "query": "cuisine or restaurant",
                    "near": "location",
                    "price": "1",
                    "open_now": true
                }
        }

        Rules: 
            - action must be exactly "restaurant_search"
            - price must be one of: "1", "2", "3", "4" (as strings)
            - open_now must be boolean (true / false)
            - exclude fields if not mentioned in the query
        Extract the following information: 
            - query: type of cuisine or restaurant
            - near: location (city, address)
            - price: price level as strings "1" being the most affordable and "4" being the most expensive
            - open_now: boolean, true if user mentions "open now" or similar


        User Message: "${userQuery}"
        Only return valid JSON format.
    `;

    try {
        const response = await ai.models.generateContent({ 
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: zodToJsonSchema(
                    RestaurantCommandSchema, 
                    "restaurantCommand"
                )
            } 
        });

        if (!response.text) throw new Error("No response text received from Gemini AI");

        const responseText = JSON.parse(response.text)
        const result = RestaurantCommandSchema.parse(responseText)

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