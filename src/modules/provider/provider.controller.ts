import { Request, Response } from "express"
import { providerSevices } from "./provider.service";


// * Create Provider Profile 
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

// * Update Provider Profile
const updateProfile = async (req: Request, res: Response) => {
    const { id} = req.params;
    const updateData = req.body;
    const result = await providerSevices.updateProfile(updateData, id);
    res.status(201).json(result)
}




export const providerController = {
    createProviderProfile,
    updateProfile
}