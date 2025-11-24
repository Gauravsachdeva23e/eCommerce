"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateOrderStatus } from "@/app/actions"
import { Badge } from "@/components/ui/badge"

interface OrderStatusProps {
    orderId: string
    status: string
}

export function OrderStatus({ orderId, status }: OrderStatusProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true)
        await updateOrderStatus(orderId, newStatus)
        setIsLoading(false)
        router.refresh()
    }

    return (
        <Select defaultValue={status} onValueChange={handleStatusChange} disabled={isLoading}>
            <SelectTrigger className="w-[140px] h-8">
                <SelectValue>
                    <Badge variant={
                        status === 'Delivered' ? 'default' :
                            status === 'Pending' ? 'secondary' : 'outline'
                    }>
                        {status}
                    </Badge>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Process">In Process</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
        </Select>
    )
}
