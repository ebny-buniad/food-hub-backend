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
                error: "Category list already exists"
            })
        }
    }
}

const updateCategories = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id || typeof id != "string"){
            throw new Error("Invalid category id");
        }
        const data = req.body;
        const result = await categoriesSevices.updateCategories(data, id);
        res.status(200).json(result)
    }
    catch (error) {
        res.status(400).json({
            error: "Category update failed",
            details: error
        })
    }
}


export const categoriesController = {
    createCategories,
    updateCategories
}