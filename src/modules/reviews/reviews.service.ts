import { prisma } from "../../lib/prisma"

const createReviews = async (data: any, userId: string) => {
    const { mealId, rating, comment } = data;

    const result = await prisma.$transaction(async (tx) => {
        //  check meal exists
        const meal = await tx.meals.findUnique({
            where: { id: mealId },
        });

        if (!meal) {
            throw new Error("Meal not found");
        }

        //  create review
        const review = await tx.reviews.create({
            data: {
                customerId: userId,
                mealId,
                rating,
                comment,
            },
        });

        //  update rating system
        const newRatingSum = meal.ratingSum + rating;
        const newRatingCount = meal.ratingCount + 1;
        const newRatingAvg = newRatingSum / newRatingCount;

        await tx.meals.update({
            where: { id: mealId },
            data: {
                ratingSum: newRatingSum,
                ratingCount: newRatingCount,
                ratingAvg: newRatingAvg,
            },
        });

        return review;
    });

    return result;
};

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

