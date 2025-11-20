import express from 'express';  
import searchRoute from "./routes/searchRoute.js";
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

dotenv.config();
const app = express();
const port = 3000;

const limit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: 'Too many requests, please try again later.'
});

app.use(limit);

app.use('/search', searchRoute);

app.get('/', (_, res) => {
    res.send('Application is up and running!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
