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

// * Get Provider Profile
const getProviderProfile = async (id: string) => {
    const profile = await prisma.providerProfiles.findUnique({
        where: {
            userId: id
        }
    });

    const providerId = profile?.id;
    if (!providerId) {
        return {
            status: 404,
            success: false,
            message: "Provider not found, create profile"
        }
    }

    return profile;
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
const getProvider = async (id: string) => {
    const provider = await prisma.providerProfiles.findUnique({
        where: {
            userId: id
        },
        include: {
            meals: {
                select: {
                    id: true,
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
            providerId: providerId,
            status: {
                in: ["PLACED", "DELIVERED"]
            }
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


// Get provider stats

const getProviderStats = async (userId: string) => {
    // First get provider from logged-in user
    const provider = await prisma.providerProfiles.findUnique({
        where: {
            userId: userId
        }
    });

    if (!provider) {
        throw new Error("Provider not found");
    }

    const providerId = provider?.id;

    const [totalMeals, totalOrders, revenue] = await Promise.all([
        prisma.meals.count({
            where: { providerId }
        }),
        prisma.orders.count({
            where: { providerId }
        }),
        prisma.orders.aggregate({
            where: {
                providerId,
                status: "DELIVERED"
            },
            _sum: {
                totalAmount: true
            }
        })
    ]);

    return {
        totalMeals,
        totalOrders,
        totalRevenue: revenue._sum.totalAmount || 0
    };
};

export const providerSevices = {
    createProviderProfile,
    getProviderProfile,
    updateProfile,
    getProvider,
    getProviders,
    getProviderOrders,
    getProviderOrderById,
    updateOrderStatus,
    getProviderStats
}