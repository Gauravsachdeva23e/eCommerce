import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AddressForm } from "@/components/shop/AddressForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteAddress } from "@/app/actions"
import { Trash } from "lucide-react"
import { LogoutButton } from "@/components/auth/LogoutButton"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    const addresses = await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    })

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: true },
        orderBy: { createdAt: "desc" }
    })

    const orderCount = orders.length

    return (
        <div className="container py-10 space-y-8">
            <h1 className="text-3xl font-bold">My Profile</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Personal Information</h2>
                        <LogoutButton />
                    </div>
                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                    <p className="text-lg font-medium">{user?.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                    <p className="text-lg font-medium">{user?.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                                    <p className="text-lg font-medium">{orderCount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <AddressForm />
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Order History</h2>
                    <div className="space-y-4 mb-8">
                        {orders.map((order) => (
                            <Card key={order.id}>
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium">Order #{order.id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">₹{order.total.toLocaleString('en-IN')}</p>
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {order.items.length} items
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {orders.length === 0 && (
                            <p className="text-muted-foreground">No orders found.</p>
                        )}
                    </div>

                    <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
                    <div className="space-y-4">
                        {addresses.map((addr) => (
                            <Card key={addr.id}>
                                <CardContent className="pt-6 flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{addr.houseNumber}, {addr.locality}</p>
                                        {addr.landmark && <p className="text-sm text-muted-foreground">{addr.landmark}</p>}
                                        <p className="text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                                    </div>
                                    <form action={async () => {
                                        "use server"
                                        await deleteAddress(addr.id)
                                    }}>
                                        <Button variant="ghost" size="icon" type="submit">
                                            <Trash className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        ))}
                        {addresses.length === 0 && (
                            <p className="text-muted-foreground">No addresses saved yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
