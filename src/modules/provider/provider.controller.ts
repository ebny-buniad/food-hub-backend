import { Request, Response } from "express"
import { providerSevices } from "./provider.service";

//  Create Provider Profile 
const createProviderProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user",
            });
        }
        const providerInfo = req.body;
        const result = await providerSevices.createProviderProfile(providerInfo, userId);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Provider profile create failed",
            details: error
        })
    }
}

// * Get Provider Profile
const getProviderProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const result = await providerSevices.getProviderProfile(userId as string);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Provider profile get failed",
            details: error
        })
    }
}


// * Get all providers
const getProviders = async (req: Request, res: Response) => {
    try {
        const result = await providerSevices.getProviders();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Providers get failed",
            details: error
        })
    }
}

// Get provider
const getProvider = async (req: Request, res: Response) => {
    try {
        const id = req.user?.id;
        const result = await providerSevices.getProvider(id as string)
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Provider get failed",
            details: error
        })
    }
}


// * Get provider orders

const getProviderOrders = async (req: Request, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id || typeof id !== "string") {
            return {
                message: "User id is invallied"
            }
        }
        const result = await providerSevices.getProviderOrders(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Provider orders get failed",
            details: error
        })
    }
}


// * Get provider order by Id

const getProviderOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return {
                message: "Order id invallied"
            }
        }
        const result = await providerSevices.getProviderOrderById(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Provider order get failed",
            details: error
        })
    }
}


// * Update order status

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return {
                message: "Id requred!"
            }
        }
        const data = req.body;
        const result = await providerSevices.updateOrderStatus(data, id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Order status update failed",
            details: error
        })
    }
}



// * Update Provider Profile
const updateProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return {
                message: "Id requred!"
            }
        }
        const updateData = req.body;
        const result = await providerSevices.updateProfile(updateData, id);
        res.status(201).json(result)
    }
    catch (error) {
        res.status(400).json({
            error: "Provider profile update failed",
            details: error
        })
    }
}

const getProviderStats = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const result = await providerSevices.getProviderStats(userId as string);
        res.status(200).json(result)
    }
    catch (error) {
        res.status(400).json({
            error: "Provider stats get failed",
            details: error
        })
    }
}




export const providerController = {
    createProviderProfile,
    getProviderProfile,
    updateProfile,
    getProviders,
    getProvider,
    getProviderOrders,
    getProviderOrderById,
    updateOrderStatus,
    getProviderStats
}