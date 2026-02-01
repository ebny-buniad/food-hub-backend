import express, { Application } from "express"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';

import { mealsRouter } from "./modules/meals/meals.router";
import { providerRouter } from "./modules/provider/provider.router";
import { categoriesRouter } from "./modules/categories/categories.router";
import { ordersRouter } from "./modules/orders/orders.router";


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

// * Provider Routes
app.use("/api", mealsRouter);
app.use("/api/provider/profile", providerRouter);

// User Routes
app.use("/api", ordersRouter);

// * Admin Routes
app.use("/api/admin/categories", categoriesRouter);


export default app;