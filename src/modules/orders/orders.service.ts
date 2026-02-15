import { UserRole } from "../../enum";
import { prisma } from "../../lib/prisma"

const createOrder = async (data: any, userId: string) => {
    console.log(data)
    const { cartId, providerId, deliveryAddress, items } = data;

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
        });
    }

    // * Update total amount
    await prisma.orders.update({
        where: { id: order.id },
        data: { totalAmount }
    })

    // Update cart items status 
    const updateCartStatus = await prisma.cart.update({
        where: {
            id: cartId,
            status: "ACTIVE"
        },
        data: {
            status: "ORDERED"
        }
    })
    return updateCartStatus;
}

// * Get user orders
const getOrders = async (userId: string) => {
    const orders = await prisma.orders.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            status: true,
            deliveryAddress: true,
            paymentMethod: true,
            totalAmount: true,
            createdAt: true,
            provider: {
                select: {
                    id: true,
                    restaurentName: true
                }
            },
            orderItems: {
                select: {
                    quantity: true,
                    price: true,
                    meals: {
                        select: {
                            id: true,
                            name: true,
                            thumbnail: true
                        }
                    }
                }
            }
        }
    });

    return orders;
}

// * Get Order by Id
const getOrderById = async (id: string) => {
    const order = await prisma.orders.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            status: true,
            deliveryAddress: true,
            paymentMethod: true,
            totalAmount: true,
            createdAt: true,
            provider: {
                select: {
                    id: true,
                    restaurentName: true
                }
            },
            orderItems: {
                select: {
                    quantity: true,
                    price: true,
                    meals: {
                        select: {
                            id: true,
                            name: true,
                            thumbnail: true
                        }
                    }
                }
            }
        }
    });
    return order;
}

// Update order ststus

const updateOrderStatus = async (orderId: string, userId: string, role: string) => {
    if (role === UserRole.USER) {
        await prisma.orders.update({
            where: {
                userId: userId,
                id: orderId
            },
            data: {
                status: "CANCELED"
            }
        })
    }
    else if (role === UserRole.PROVIDER) {
        await prisma.orders.update({
            where: {
                id: orderId
            },
            data: {
                status: "DELIVERED"
            }
        })
    }
    return;
}


export const ordersServices = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
}