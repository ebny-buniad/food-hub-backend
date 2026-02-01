import { Request, Response } from "express"
import { ordersServices } from "./orders.service";

const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return {
                message: "Please login you account first!"
            }
        }
        const orderData = req.body;
        console.log(orderData)
        const result = await ordersServices.createOrder(orderData, userId);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Order create failed",
            details: error
        })
    }
}

export const ordersController = {
    createOrder
}