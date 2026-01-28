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
    updateProfile
}