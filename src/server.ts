import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 8080;

async function server() {
    try {
        await prisma.$connect();
        console.log("Connected Database Successfully!!")
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (err) {
        console.error("An Error Occurred", err);
        await prisma.$disconnect();
        process.exit(1);
    }
}

server();