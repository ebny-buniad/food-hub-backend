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
    const where: any = {
        AND: [],
    };

    //  SEARCH (AI)
    if (filters.q) {
        where.AND.push({
            OR: [
                {
                    name: {
                        contains: filters.q,
                        mode: "insensitive",
                    },
                },
                {
                    tags: {
                        hasSome: [filters.q],
                    },
                },
                {
                    searchKeywords: {
                        hasSome: [filters.q],
                    },
                },
                {
                    searchText: {
                        contains: filters.q,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    // dietary filter
    if (filters.dietary) {
        where.AND.push({
            dietary: filters.dietary,
        });
    }

    // price filter
    if (filters.minPrice || filters.maxPrice) {
        const priceFilter: any = {};

        if (filters.minPrice)
            priceFilter.gte = Number(filters.minPrice);

        if (filters.maxPrice)
            priceFilter.lte = Number(filters.maxPrice);

        where.AND.push({
            price: priceFilter,
        });
    }

    // cuisine filter
    if (filters.cuisine) {
        where.AND.push({
            category: {
                cuisine: filters.cuisine,
            },
        });
    }

    const result = await prisma.meals.findMany({
        where: where.AND.length ? where : {},
        orderBy: [
            { isFeatured: "desc" },
            { totalOrders: "desc" },
            { createdAt: "desc" },
        ],
        select: {
            id: true,
            name: true,
            price: true,
            thumbnail: true,
            ratingAvg: true,
            category: {
                select: {
                    cuisine: true,
                },
            },
            isAvailable: true
        },
    });

    return result;
};

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

// TRENDING Food

const getTrendingMeals = async () => {
    return await prisma.meals.findMany({
        orderBy: {
            totalOrders: "desc",
        },
        take: 6,
        select: {
            id: true,
            name: true,
            thumbnail: true,
            price: true,
            ratingAvg: true,
        },
    });
};

// RECOMMENDATION FOOD

const getRecommendedMeals = async (mealId: string) => {
    const meal = await prisma.meals.findUnique({
        where: { id: mealId },
    });

    if (!meal) throw new Error("Meal not found");

    const result = await prisma.meals.findMany({
        where: {
            AND: [
                {
                    id: { not: mealId }, // exclude current meal
                },
                {
                    OR: [
                        { categoryId: meal.categoryId }, // same category
                        {
                            tags: {
                                hasSome: meal.tags, // similar tags
                            },
                        },
                    ],
                },
            ],
        },
        take: 6,
        orderBy: [
            { ratingAvg: "desc" },
            { totalOrders: "desc" },
        ],
        select: {
            id: true,
            name: true,
            thumbnail: true,
            price: true,
            ratingAvg: true,
        },
    });

    return result;
};

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
        where: { id: id }
    });
    return result;
};



export const mealsServices = {
    createMeal,
    getAllMeals,
    getTrendingMeals,
    getRecommendedMeals,
    updateMeal,
    getMeal,
    deleteMeal
}