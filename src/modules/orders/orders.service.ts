import { prisma } from "../../lib/prisma"

const createOrder = async (data: any, userId: string) => {
    const { providerId, deliveryAddress, items } = data;
    const order = await prisma.orders.create({
        data: {
            userId,
            providerId,
            deliveryAddress,
            totalAmount: 0
        }
    });

    let totalAmount = 0;

    // * Create orderItems
    for (const item of items) {
        const meal = await prisma.meals.findUnique({
            where: {
                id: item.mealId
            }
        });

        if (!meal) {
            throw new Error("Meal not found");
        };

        const price = Number(meal.price) * item.quantity;
        totalAmount = totalAmount + price;

        await prisma.orderItems.create({
            data: {
                orderID: order.id,
                mealId: meal.id,
                categoryId: meal.categoryId!,
                quantity: item.quantity,
                price: meal.price
            }
        })
    }

    // * Update total amount
    const updateOrderAmount = await prisma.orders.update({
        where: { id: order.id },
        data: { totalAmount }
    })


    return updateOrderAmount;
}

export const ordersServices = {
    createOrder
}