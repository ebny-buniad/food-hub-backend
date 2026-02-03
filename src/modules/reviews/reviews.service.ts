import { prisma } from "../../lib/prisma"

const createReviews = async (data: any, id: string) => {
    const reviews = await prisma.reviews.create({
        data: {
            customerId: id,
            ...data
        }
    });
    return reviews;
}

export const reviewsServices = {
    createReviews
} 