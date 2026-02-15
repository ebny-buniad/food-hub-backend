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
        },
        include: {
            meals: {
                select: {
                    dietary: true,
                    category: true,
                    name: true,
                    description: true,
                    price: true,
                    thumbnail: true,
                    isAvailable: true,
                    reviews: true
                }
            }
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
                    description: true,
                    thumbnail: true,
                    price: true,
                    isAvailable: true,
                }
            }
        }
    })

    return provider;
}


// * Get provider orders
const getProviderOrders = async (id: string) => {
    // * Get provider profile by user Id
    const providerProfile = await prisma.providerProfiles.findUnique({
        where: {
            userId: id
        }
    });
    const providerId = providerProfile?.id;
    if (!providerId) {
        throw new Error("Provider profile not found");
    }

    const providerOrders = await prisma.orders.findMany({
        where: {
            providerId: providerId
        },
        select: {
            id: true,
            deliveryAddress: true,
            user: {
                select: {
                    name: true,
                    email: true,
                }
            },
            orderItems: {
                select: {

                    category: {
                        select: {
                            cuisine: true
                        }
                    },
                    meals: {
                        select: {
                            name: true,
                            price: true
                        }
                    },
                    quantity: true,
                }
            },
            paymentMethod: true,
            totalAmount: true,
            createdAt: true,
            status: true
        }
    });
    return providerOrders;
}

// * Get provider order by Id

const getProviderOrderById = async (id: string) => {
    const providerOrder = await prisma.orders.findUnique({
        where: {
            id: id
        }
    });
    return providerOrder;
}


// * Update order status

const updateOrderStatus = async (data: any, id: string) => {
    const orderStatus = await prisma.orders.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    })
    return orderStatus;
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
    getProviders,
    getProviderOrders,
    getProviderOrderById,
    updateOrderStatus
}