import { prisma } from "../../lib/prisma"
import { Meal } from "../../types";

// * Create meal
const createMeal = async (data: Meal, id: string) => {
    // * Get provider profile by user Id
    const providerProfile = await prisma.providerProfiles.findUnique({
        where: {
            userId: id
        }
    });
    const providerId = providerProfile?.id;
    if (!providerId) {
        return {
            message: "Provider profile not found",
            status: 404
        }
    }
    const result = await prisma.meals.create({
        data: {
            providerId,
            ...data
        }
    });
    return result;
}

// * Get all Meals 
const getAllMeals = async (filters: any) => {
    const where: any = {}
    // dietary filter
    if (filters.dietary) {
        where.dietary = filters.dietary;
    }

    // price range filter
    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = Number(filters.minPrice);
        if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
    }

    // cuisine filter (relation)
    if (filters.cuisine) {
        where.category = {
            cuisine: filters.cuisine
        };
    }

    const result = await prisma.meals.findMany({
        where,
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            providerId: true,
            dietary: true,
            category: {
                select: {
                    cuisine: true
                }
            },
            name: true,
            description: true,
            price: true,
            thumbnail: true,
            isAvailable: true,
            reviews: {
                select: {
                    rating: true,
                    customer: {
                        select: {
                            name: true
                        }
                    },
                    comment: true,
                    createdAt: true
                }
            },
            createdAt: true
        }
    });
    return result;
}

// * Get single meal by Id
const getMeal = async (id: string) => {
    const result = await prisma.meals.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            providerId: true,
            dietary: true,
            category: {
                select: {
                    cuisine: true
                }
            },
            name: true,
            description: true,
            price: true,
            thumbnail: true,
            isAvailable: true,
            reviews: {
                select: {
                    rating: true,
                    customer: {
                        select: {
                            name: true
                        }
                    },
                    comment: true,
                    createdAt: true
                }
            },
            createdAt: true
        }
    });
    return result;
}

// * Update Meals
const updateMeal = async (data: any, id: string) => {
    const result = await prisma.meals.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    });
    return result;
}

// * Delete meal
const deleteMeal = async (id: string) => {
    const result = await prisma.meals.delete({
        where: {
            id: id
        }
    })
}

export const mealsServices = {
    createMeal,
    getAllMeals,
    updateMeal,
    getMeal,
    deleteMeal
}