import { date } from "better-auth/*";
import { prisma } from "../../lib/prisma"

// * Create review
const createReviews = async (data: any, id: string) => {
    const reviews = await prisma.reviews.create({
        data: {
            customerId: id,
            ...data
        }
    });
    return reviews;
}

// Get customer review
const getCustomerReviews = async (id: string) => {
    const customerReviews = await prisma.reviews.findMany({
        where: {
            customerId: id
        }
    });
    return customerReviews
}

// Update reviews 

const updateReviews = async (data: any, id: any) => {
    const update = await prisma.reviews.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    });
    return update;
}


export const reviewsServices = {
    createReviews,
    getCustomerReviews,
    updateReviews
}

