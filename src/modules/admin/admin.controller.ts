import { Request, Response } from "express"
import { adminServices } from "./admin.service"

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getUsers();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Get users failed",
            details: error
        })
    }
}

// Get all orders

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getAllOrders();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Get users failed",
            details: error
        })
    }
}

// * Update user status

const updateUserRole = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== "string") {
            return {
                message: "User id invallied"
            }
        }
        const data = req.body;
        const result = await adminServices.updateUserRole(data, id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Update user status failed",
            details: error
        })
    }
}

// Update user staus

const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const result = await adminServices.updateUserStatus(userId as string);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Update user status failed",
            details: error
        })
    }
}

export const adminController = {
    getUsers,
    getAllOrders,
    updateUserRole,
    updateUserStatus
}