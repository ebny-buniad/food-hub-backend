import { Request, Response } from "express";

const getMe = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.status(200).json({
            success: true,
            data: req.user
        });
    }
    catch (err) {
        console.log(err)
    }
};

export const authController = {
    getMe
}