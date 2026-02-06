import express, { Application } from "express"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';

import { mealsRouter } from "./modules/meals/meals.router";
import { providerRouter } from "./modules/provider/provider.router";
import { categoriesRouter } from "./modules/categories/categories.router";
import { ordersRouter } from "./modules/orders/orders.router";
import { adminRoter } from "./modules/admin/admin.router";
import { authRouter } from "./modules/auth/auth.router";
import { reviewsRouter } from "./modules/reviews/reviews.router";
import { cartRouter } from "./modules/cart/cart.router";


const app: Application = express();
app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL, // client side url
    credentials: true
}))


app.get('/', (req, res) => {
    res.send('Running Food Hub Server')
})

app.all('/api/auth/*splat', toNodeHandler(auth));

// Get me
app.use("/api", authRouter)

// * Provider Routes
app.use("/api", mealsRouter);
app.use("/api", providerRouter);

// User Routes
app.use("/api", ordersRouter);
app.use("/api", reviewsRouter);

app.use("/api", cartRouter)

// * Admin Routes
app.use("/api", categoriesRouter);
app.use("/api", adminRoter)


export default app;