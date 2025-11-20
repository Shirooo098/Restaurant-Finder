import z from "zod";

export const RestaurantCommandSchema = z.object({
    action: z.literal("restaurant_search"),
    parameters: z.object({
        query: z.string(),
        near: z.string().optional(),
    })
})

export type RestaurantCommand = z.infer<typeof RestaurantCommandSchema>

export const FourSquareRestaurantSchema = z.object({
    fsq_place_id: z.string(),
    name: z.string(),
    categories: z.array(
        z.object({
            name: z.string()
        })
    ),
    location: z.object({
        formatted_address: z.string(),
        locality: z.string().optional(),
        region: z.string().optional()
    }),
    // rating: z.number().optional(),
    //  price: z.enum(["1", "2", "3", "4"]).optional(),
    // hours: z.object({
    //     display: z.string(),
    //     is_local_holiday: z.boolean(),
    //     open_now: z.boolean(),
    //     regular: z.array(
    //         z.object({
    //             close: z.string(),
    //             open: z.string()
    //         })
    //     ).optional()
    // }).optional(),
    // sort: z.enum(["relevance", "rating", "distance", "popularity"]).optional()
})

export type FourSquareResto = z.infer<typeof FourSquareRestaurantSchema>

export const FourSquareResponseSchema = z.object({
    results: z.array(FourSquareRestaurantSchema)
})

export type FourSquareResponse = z.infer<typeof FourSquareResponseSchema>