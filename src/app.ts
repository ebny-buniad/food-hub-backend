import express, { Application } from "express"
const app: Application = express();
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Running Food Hub Server')
})


export default app;