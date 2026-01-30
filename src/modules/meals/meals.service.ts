import { prisma } from "../../lib/prisma"
import { Meal } from "../../types";

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

    // * Create meal
    const result = await prisma.meals.create({
        data: {
            providerId,
            ...data
        }
    });
    return result;
}

const getAllMeals = async () => {
    const result = await prisma.meals.findMany();
    return result;
}

export const mealsServices = {
    createMeal,
    getAllMeals
}