import { prisma } from "../../lib/prisma"

const createMeal = async (data: any) => {
    // console.log(data)
    // const result = await prisma.meals.create({
    //     data: {
    //         ...data
    //     }
    // });
    // return result;
}

export const mealsServices = {
    createMeal
}