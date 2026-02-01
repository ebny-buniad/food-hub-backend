import { prisma } from "../../lib/prisma"
import { ProviderProfile } from "../../types"

// * Create Provider Profile 
const createProviderProfile = async (data: ProviderProfile, userId: string) => {
    const profileInfo = { userId, ...data }
    const result = await prisma.providerProfiles.create({
        data: {
            ...profileInfo
        }
    })
    return result;
}

// * Get all providers
const getProviders = async () => {
    const providers = await prisma.providerProfiles.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    return providers;
}


// * Update Provider Profile
const updateProfile = async (data: ProviderProfile, id: any) => {
    const updateData = await prisma.providerProfiles.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    });
    return updateData;
}



export const providerSevices = {
    createProviderProfile,
    updateProfile,
    getProviders
}