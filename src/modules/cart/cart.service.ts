import { prisma } from "../../lib/prisma"

const createCart = async (data: any, userId: string) => {
    //  Find ACTIVE cart
    let cart = await prisma.cart.findFirst({
        where: {
            userId,
            status: "ACTIVE",
        },
    });

    //  If not exist create
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId,
                status: "ACTIVE",
            },
        });
    }

    //  Get meal
    const meal = await prisma.meals.findUnique({
        where: { id: data.mealId },
    });

    if (!meal) {
        return {
            message: "Meal not found",
        };
    }

    // Check existing cart item
    const existingItem = await prisma.cartItems.findFirst({
        where: {
            cartId: cart.id,
            mealId: data.mealId,
        },
    });

    if (existingItem) {
        // Update quantity
        await prisma.cartItems.update({
            where: { id: existingItem.id },
            data: {
                quantity: existingItem.quantity + data.quantity,
                price:
                    Number(meal.price) *
                    (existingItem.quantity + data.quantity),
            },
        });
    } else {
        // Create new cart item
        await prisma.cartItems.create({
            data: {
                cartId: cart.id,
                mealId: data.mealId,
                quantity: data.quantity,
                price: Number(meal.price) * data.quantity,
            },
        });
    }
    return {
        message: "Item added to cart",
        cartId: cart.id,
    };
};



// * Get cart items
const getCartItems = async (id: string) => {
    const cartItems = await prisma.cart.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            userId: true,
            status: true,
            cartItems: true
        }
    });

    // console.log(cartItems)

    // find items from cart

    if (!cartItems) {
        return {
            message: "Items add in cart"
        }
    }

    // find meal by meal id
    // const cartInfo = [];

    for (const item of cartItems) {
        console.log(item)
        // const meal = await prisma.meals.findUnique({
        //     where: {
        //         id: item.cartItems
        //     }
        // })
        // const cartData = {
        //     ...item,
        //     thumbnail: meal?.thumbnail,
        //     name: meal?.name
        // }
        // cartInfo.push(cartData)
    }
    // console.log(cartInfo)
    // return cartInfo;
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