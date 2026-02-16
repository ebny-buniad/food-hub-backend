import { prisma } from "../../lib/prisma"

// Get all user
const getUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}

// Get all order

const getAllOrders = async () => {
    const orders = await prisma.orders.findMany({
        include: {
            orderItems: true
        }
    });
    return orders;
}

// * Update user role
const updateUserRole = async (data: any, id: string) => {
    const roleChange = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    })
    return roleChange;
}


// Update user status (Active/suspend)

const updateUserStatus = async (userId: string) => {

    //  First get user
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        throw new Error("User not found");
    }

    //  Toggle logic
    const newStatus =
        existingUser.status === "ACTIVE"
            ? "SUSPENDED"
            : "ACTIVE";

    //  Update user
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: newStatus },
    });

    return updatedUser;
};



export const adminServices = {
    getUsers,
    updateUserRole,
    updateUserStatus,
    getAllOrders
}