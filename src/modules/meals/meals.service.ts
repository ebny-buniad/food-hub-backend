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
        throw new Error("Provider profile not found");
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
const getAllMeals = async () => {
    const result = await prisma.meals.findMany({
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