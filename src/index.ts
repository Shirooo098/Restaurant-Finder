import express from 'express';  

const app = express();
const port = 3000

app.get('/', (_, res) => {
    res.send('Application is up and running!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});