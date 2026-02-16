import { prisma } from "../../lib/prisma"

// Get all user
const getUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
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

const updateUserStatus = async (data: any) => {
    const userStatus = await prisma.user.update({
        where: {
            id: data?.userId
        },
        data: {
            status: data?.status?.status
        }
    });
    return userStatus;
}


export const adminServices = {
    getUsers,
    updateUserRole,
    updateUserStatus
}