
import { prisma } from "./src/lib/prisma"

async function main() {
    console.log("Fetching users and order counts...")
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: { orders: true }
            }
        }
    })

    console.log("\nUser Data:")
    users.forEach(user => {
        console.log(`User: ${user.name} (${user.phone}) - ID: ${user.id}`)
        console.log(`Order Count: ${user._count.orders}`)
        console.log("-------------------")
    })

    const orders = await prisma.order.findMany({
        select: { id: true, userId: true }
    })
    console.log("\nTotal Orders in DB:", orders.length)
    if (orders.length > 0) {
        console.log("Sample Order User IDs:", orders.slice(0, 5).map(o => o.userId))
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
