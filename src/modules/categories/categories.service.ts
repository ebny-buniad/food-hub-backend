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

// * Update categories
const updateCategories = async (data: Categories, id:string) => {
    const result = await prisma.categories.update({
        where:{
            id: id
        },
        data:{
            ...data
        }
    })
}

export const categoriesSevices = {
    createCategories,
    updateCategories
}