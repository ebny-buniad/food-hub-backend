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

// * Get cart items
const getCartItems = async (id: string) => {
    const cartItems = await prisma.cart.findUnique({
        where: {
            userId: id
        },
        select: {
            id: true,
            userId: true,
            status: true,
            cartItems: {
                select: {
                    id: true,
                    cartId: true,
                    mealId: true,
                    price: true,
                    quatity: true
                }
            }
        }
    });

    // find items from cart
    const items = cartItems?.cartItems;
    if (!items) {
        return {
            message: "Items add in cart"
        }
    }

    // find meal by meal id
    const cartInfo = [];
    for (const item of items) {
        const meal = await prisma.meals.findUnique({
            where: {
                id: item.mealId
            }
        })
        const cartData = {
            ...item,
            thumbnail: meal?.thumbnail,
            name: meal?.name
        }
        cartInfo.push(cartData)
    }
    return cartInfo;
}

// Delete cart items 

const deleteCartItems = async (id: string) => {
    const deleteItems = await prisma.cartItems.delete({
        where: {
            id: id
        }
    });
    return deleteItems;
}




export const cartService = {
    createCart,
    getCartItems,
    deleteCartItems
}