import { FourSquareResponseSchema, type RestaurantCommand } from "../schema/schema.js";

export async function searchFoursquare(structuredQuery: RestaurantCommand){
    const { parameters } = structuredQuery;
    const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
    const FOURSQUARE_SEARCH_URL = "https://places-api.foursquare.com/places/search";

    if(!FOURSQUARE_API_KEY) throw new Error("Foursquare API key is not configured");
    
    const queryParams = new URLSearchParams({
        query: parameters.query,
        near: parameters.near,
        category: "13065",
        limit: "5",
    });

    const url: string = `${FOURSQUARE_SEARCH_URL}?${queryParams.toString()}`
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
                Accept: "application/json",
                "X-Places-Api-Version": "2025-06-17"
            }
        });

        if(!response.ok){
            console.error("Status: ", response.status);
            throw new Error(`Fetch Error: ${response.status}`)
        }

        const data = await response.json();
        const validatedResponse = FourSquareResponseSchema.parse(data);

        const restaurants = validatedResponse.results;

        const results = restaurants.map((resto) => ({
            name: resto.name,
            address: resto.location.formatted_address,
            cuisine: resto.categories.map((categ) => categ.name).join(', '),
            // rating: resto.rating,
            // price_level: resto.price,
            // open_now: resto.hours?.open_now,
            // sort: resto.sort
        }));

        return results;
    } catch (error: unknown) {
        console.error("Fetch Error: ", error);
        throw error; 
    }
}