import { prisma } from "../lib/prisma"

async function main() {
    try {
        const userCount = await prisma.user.count()
        console.log("User count:", userCount)
    } catch (e) {
        console.error("Prisma Error:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
