import { prisma } from "../../lib/prisma"
import { Categories } from "../../types";

const createCategories = async (data: Categories) => {
    const result = await prisma.categories.create({
        data: {
            ...data
        }
    })
    return result;
}

export const categoriesSevices = {
    createCategories
}