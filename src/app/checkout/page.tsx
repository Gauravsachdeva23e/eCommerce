import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CheckoutForm } from "@/components/shop/CheckoutForm"

export default async function CheckoutPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login?callbackUrl=/checkout")

    const addresses = await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <CheckoutForm addresses={addresses} />
        </div>
    )
}
