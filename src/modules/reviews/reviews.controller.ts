import { Request, Response } from "express";
import { reviewsServices } from "./reviews.service";


// Create review
const createReviews = async (req: Request, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) {
            return {
                message: "User id invallied"
            }
        }
        const data = req.body;
        console.log(data)
        const result = await reviewsServices.createReviews(data, id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Review create failled!",
            details: error
        })
    }
}

// Get customer reviews

const getCustomerReviews = async (req: Request, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) {
            return {
                message: "User id invallied"
            }
        }

        const result = await reviewsServices.getCustomerReviews(id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Review get failled!",
            details: error
        })
    }
}

// Update Revirews
const updateReviews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await reviewsServices.updateReviews(data, id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Review update failled!",
            details: error
        })
    }
}

export const reviewsContoller = {
    createReviews,
    getCustomerReviews,
    updateReviews

}