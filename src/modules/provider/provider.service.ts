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

// Get signle provider with menu

const getProvider = async (P_Id: string) => {
    const provider = await prisma.providerProfiles.findUnique({
        where: {
            id: P_Id
        },
        select: {
            id: true,
            image: true,
            restaurentName: true,
            description: true,
            address: true,
            isOpen: true,
            meals: {
                select: {
                    name: true,
                    description:true,
                    thumbnail: true,
                    price: true,
                    isAvailable: true,
                }
            }
        }
    })

    return provider;
}

// * Update Provider Profile
const updateProfile = async (data: ProviderProfile, id: string) => {
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
    getProvider,
    getProviders
}