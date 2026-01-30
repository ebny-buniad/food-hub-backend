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
    const result = await prisma.meals.findMany();
    return result;
}

// * Update Meals
const updateMeal = async (data:any, id:string) => {
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

export const mealsServices = {
    createMeal,
    getAllMeals,
    updateMeal
}