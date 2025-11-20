import express from 'express';  
import searchRoute from "./routes/searchRoute.js";
import dotenv from 'dotenv';

dotenv.config()
const app = express();
const port = 3000

app.use('/search', searchRoute)

app.get('/', (_, res) => {
    res.send('Application is up and running!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});