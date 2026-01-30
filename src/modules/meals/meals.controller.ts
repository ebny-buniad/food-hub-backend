import { Request, Response } from "express";
import { mealsServices } from "./meals.service";

// * Create meal
const createMeal = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized user"
            });
        }
        const mealData = req.body;
        const result = await mealsServices.createMeal(mealData, userId);
        res.status(201).json(result)
    }
    catch (error) {
        res.status(400).json({
            error: "Meal creation failed",
            details: error
        })
    }
}

// * Get all meals
const getAllMeals = async (req: Request, res: Response) => {
    try {
        const result = await mealsServices.getAllMeals();
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Meals get failed",
            details: error
        })
    }
}

// * Get meal by Id
const getMeal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            throw new Error("Invallid meal id");
        }
        const result = await mealsServices.getMeal(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Meal get failed",
            details: error
        })
    }
}

// * Update meals
const updateMeal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            throw new Error("Invalid category id");
        }
        console.log(id)
        const updateData = req.body;
        console.log(updateData)
        const result = await mealsServices.updateMeal(updateData, id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Meals update failed",
            details: error
        })
    }
}


export const mealsController = {
    createMeal,
    getAllMeals,
    getMeal,
    updateMeal
}