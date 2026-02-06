import { prisma } from "../../lib/prisma"

// * Create cart 
const createCart = async (data: any, id: string) => {
    const cartItems = data.items;

    // Create cart
    const cart = await prisma.cart.create({
        data: {
            userId: id
        }
    });

    // create cartItem
    for (const item of cartItems) {
        // Get meal
        const meal = await prisma.meals.findUnique({
            where: {
                id: item.mealId
            }
        })
        const cartPrice = Number(meal?.price) * item.quantity;
        const cartInfo = {
            cartId: cart.id,
            price: cartPrice,
            mealId: item?.mealId,
            quatity: item?.quantity
        }
        // create 
        await prisma.cartItems.create({
            data: {
                ...cartInfo
            }
        })
    }
    return cart;
}

export const cartService = {
    createCart
}