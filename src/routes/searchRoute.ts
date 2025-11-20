import { Router, type Request, type Response } from "express";
import type { Router as ExpressRouter } from "express";
import { interpretUserQuery } from "../services/AIService.js";
import { searchFoursquare } from "../services/foursquareService.js";

const router: ExpressRouter = Router();

router.get("/", async(req: Request, res: Response) => {
    try {
        const { message, code } = req.query;

        if(code !== process.env.ACCESS_CODE){
            return res.status(401).json({ error: "Unauthorized Access!"})
        }
        if(!message){
            return res.status(400).json({ error: "Fill up all fields!"})
        }

        const parsed = await interpretUserQuery(message as string);
        const data = await searchFoursquare(parsed)
        console.log(data)

        return res.status(200).json({ results: data });
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ 
            error: error instanceof Error ? error.message : "Internal server error" 
        });
    }
})

export default router;