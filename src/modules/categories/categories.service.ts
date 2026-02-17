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

// Get categories

const getCategories = async () => {
    const categories = await prisma.categories.findMany();
    return categories;
}

// * Delete categories
const deleteCategories = async (cateId: string) => {
    const deleteCate = await prisma.categories.delete({
        where: {
            id: cateId
        }
    });

    return deleteCate;
}


export const categoriesSevices = {
    createCategories,
    getCategories,
    deleteCategories
}