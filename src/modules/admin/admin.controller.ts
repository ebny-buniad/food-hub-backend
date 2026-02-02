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

// * Update user status

const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if(!id || typeof id !== "string"){
            return {
                message: "User id invallied"
            }
        }
        const data = req.body;
        const result = await adminServices.updateUserStatus(data, id);
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
    updateUserStatus
}