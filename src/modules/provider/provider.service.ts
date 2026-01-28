import { prisma } from "../../lib/prisma"
import { ProviderProfile } from "../../types"

const createProviderProfile = async (data: ProviderProfile, userId: string) => {
    const profileInfo = { userId, ...data }
    const result = await prisma.providerProfiles.create({
        data: {
            ...profileInfo
        }
    })
    return result;
}


export const providerSevices = {
    createProviderProfile
}