import { Request, Response } from "express";
import { mealsServices } from "./meals.service";

const createMeal = async (req: Request, res: Response) => {
    try {
        const mealData = req.body();
        const result = await mealsServices.createMeal(mealData);
        res.status(201).json(result)
    }
    catch (error) {
        res.status(400).json({
            error: "Meal creation failed",
            details: error
        })
    }
}

export const mealsController = {
    createMeal
}