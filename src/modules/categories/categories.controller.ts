import { Request, Response } from "express"
import { categoriesSevices } from "./categories.service";

const createCategories = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await categoriesSevices.createCategories(data);
        res.status(200).json(result);
    }
    catch (error: any) {
        if (error.code === "P2002") {
            res.status(400).json({
                error: "Category list already exists",
                status: 400
            })
        }
    }
}

// Get categories 

const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await categoriesSevices.getCategories();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Category update failed",
            details: error
        })
    }
}

// * DELETE Categories

const deleteCategories = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id != "string") {
            throw new Error("Invalid category id");
        }
        const result = await categoriesSevices.deleteCategories(id);
        res.status(200).json(result)
    }
    catch (error) {
        res.status(400).json({
            error: "Category update failed",
            details: error
        })
    }
}

// Admin stats 

const getAdminStats = async (req: Request, res: Response) => {
    try {
        const result = await categoriesSevices.getAdminStats();
        res.status(200).json(result)
    }
    catch (error) {
        res.status(400).json({
            error: "Admin stats getting failed",
            details: error
        })
    }
}


export const categoriesController = {
    createCategories,
    getCategories,
    deleteCategories,
    getAdminStats
}