import { prisma } from "../../lib/prisma"

const getUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}

// * Update user status

const updateUserStatus = async (data: any, id: string) => {
    const statusChange = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    })
    return statusChange;
}

export const adminServices = {
    getUsers,
    updateUserStatus
}