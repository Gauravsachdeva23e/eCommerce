"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash, EyeOff, Archive, CheckCircle, AlertCircle } from "lucide-react"
import { deleteProduct, updateProductStatus } from "@/app/actions"
import { Product } from "@/lib/data"

interface ProductActionsProps {
    product: Product
}

export function ProductActions({ product }: ProductActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this product?")) {
            setIsLoading(true)
            await deleteProduct(product.id)
            setIsLoading(false)
            router.refresh()
        }
    }

    const handleStatusUpdate = async (status: 'active' | 'draft' | 'archived' | 'out_of_stock') => {
        setIsLoading(true)
        await updateProductStatus(product.id, status)
        setIsLoading(false)
        router.refresh()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isLoading}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {product.status !== 'active' && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate('active')}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Back to Live
                    </DropdownMenuItem>
                )}
                {product.status !== 'archived' && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate('archived')}>
                        <EyeOff className="mr-2 h-4 w-4" /> Unlist
                    </DropdownMenuItem>
                )}
                {product.status !== 'out_of_stock' && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate('out_of_stock')}>
                        <AlertCircle className="mr-2 h-4 w-4" /> Out of Stock
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
