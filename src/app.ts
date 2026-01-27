import express, { Application } from "express"
import { mealsRouter } from "./modules/meals/meals.router";
const app: Application = express();
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Running Food Hub Server')
})


app.use("/api/provider/meals", mealsRouter);

export default app;