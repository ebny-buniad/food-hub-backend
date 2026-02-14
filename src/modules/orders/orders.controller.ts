import { Request, Response } from "express"
import { ordersServices } from "./orders.service";

// * Create order
const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return {
                message: "Please login you account first!"
            }
        }
        const orderData = req.body;
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

// * Get orders
const getOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const result = await ordersServices.getOrders(userId);
        res.status(200).json({
            data: result,
            success: true
        });
    }
    catch (error) {
        res.status(400).json({
            error: "Orders get failed",
            details: error
        })
    }
}

// * Get Order by Id
const getOrderById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== "string") {
            return {
                message: "Invallied Order id"
            }
        }
        const result = await ordersServices.getOrderById(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Order get failed",
            details: error
        })
    }
}

// Update order status
const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id as string;
        const role = req.user?.role as string;
        const userId = req.user?.id as string;
        
        const result = await ordersServices.updateOrderStatus(orderId, userId, role)
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Order get failed",
            details: error
        })
    }
}

export const ordersController = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
}