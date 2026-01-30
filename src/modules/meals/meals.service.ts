import { prisma } from "../../lib/prisma"

const createMeal = async (data: any, id: string) => {
    // * Get provider profile by user Id
    const providerProfile = await prisma.providerProfiles.findUnique({
        where: {
            userId: id
        }
    });
    const providerId = providerProfile?.id;

    // * Create meal
    const result = await prisma.meals.create({
        data: {
            providerId,
            ...data
        }
    });
    return result;
}

export const mealsServices = {
    createMeal
}