import { prisma } from "../../lib/prisma"

const createMeal = async (data: any) => {
    const result = await prisma.meals.create({
        data: {
            ...data
        }
    });
    return result;
}

export const mealsServices = {
    createMeal
}