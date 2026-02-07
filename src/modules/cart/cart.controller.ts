import { Request, Response } from "express";
import { cartService } from "./cart.service";

const createCart = async (req: Request, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) {
            return {
                message: "Please login you account first!"
            }
        }
        const data = req.body;
        const result = await cartService.createCart(data, id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Cart create failed",
            details: error
        })
    }
}


// Get cart items

const getCartItems = async (req: Request, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) {
            return {
                message: "Please login you account first!"
            }
        }
        const result = await cartService.getCartItems(id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Cart get failed",
            details: error
        })
    }
}

// Delete cart items

const deleteCartItems = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== "string") {
            return {
                message: "Id invallied"
            }
        }
        const result = await cartService.deleteCartItems(id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Cart delete failed",
            details: error
        })
    }

}

export const cartController = {
    createCart,
    getCartItems,
    deleteCartItems
}