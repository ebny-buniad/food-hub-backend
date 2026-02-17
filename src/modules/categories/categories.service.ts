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

// Admin stats

const getAdminStats = async () => {
    const [
        totalUsers,
        totalOrders,
        totalCategories,
        totalProviders,
        revenue,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.orders.count(),
        prisma.categories.count(),
        prisma.providerProfiles.count(),
        prisma.orders.aggregate({
            _sum: { totalAmount: true },
        })
    ]);

    return {
        totalUsers,
        totalOrders,
        totalCategories,
        totalProviders,
        totalRevenue: revenue?._sum?.totalAmount ?? 0,
    }
}


export const categoriesSevices = {
    createCategories,
    getCategories,
    deleteCategories,
    getAdminStats
}