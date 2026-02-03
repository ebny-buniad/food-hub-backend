import { Request, Response } from "express";
import { reviewsServices } from "./reviews.service";

const createReviews = async (req: Request, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) {
            return {
                message: "User id invallied"
            }
        }

        const data = req.body;
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

export const reviewsContoller = {
    createReviews
}