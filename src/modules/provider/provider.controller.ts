import { Request, Response } from "express"
import { providerSevices } from "./provider.service";

const createProviderProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user",
        });
    }
    const providerInfo = req.body;
    const result = await providerSevices.createProviderProfile(providerInfo, userId)
    res.status(201).json(result)
}


export const providerController = {
    createProviderProfile
}