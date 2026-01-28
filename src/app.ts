import express, { Application } from "express"
import { mealsRouter } from "./modules/meals/meals.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';
const app: Application = express();
app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000", // client side url
    credentials: true
}))


app.get('/', (req, res) => {
    res.send('Running Food Hub Server')
})

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use("/api/provider/meals", mealsRouter);

export default app;