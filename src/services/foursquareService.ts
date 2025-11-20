import axios from "axios";
import { FourSquareResponseSchema, type RestaurantCommand } from "../schema/schema.js";

export async function searchFoursquare(structuredQuery: RestaurantCommand){
    const { parameters } = structuredQuery;
    const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
    const FOURSQUARE_SEARCH_URL = "https://places-api.foursquare.com/places/search";

    if(!FOURSQUARE_API_KEY) throw new Error("Foursquare API key is not configured");
    
    const queryParams = {
        query: parameters.query,
        near: parameters.near,
        category: "13065" , // Restaurant Category ID
        limit: 5,
    }

    try {
        const response = await axios.get(FOURSQUARE_SEARCH_URL, {
            headers: {
                Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
                Accept: "application/json",
                'X-Places-Api-Version': '2025-06-17'
            },
            params: queryParams
        })

        const validatedResponse = FourSquareResponseSchema.parse(response.data)
        let restaurants = validatedResponse.results;

        const results = restaurants.map((resto) => ({
            name: resto.name,
            address: resto.location.formatted_address,
            cuisine: resto.categories.map((categ) => categ.name).join(', '),
            // rating: resto.rating,
            // price_level: resto.price,
            // open_now: resto.hours?.open_now,
            // sort: resto.sort
        }))

        return results;
    } catch (error: unknown) {
        if(error instanceof Error){
            console.error("Foursquare format error:", error);
            throw error;
        }

        console.error("Foursquare API Error:", error)
        throw error;
    }
}