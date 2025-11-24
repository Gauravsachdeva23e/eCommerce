"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Category } from "@/lib/db"
import { cn } from "@/lib/utils"

interface ShopFiltersProps {
    validCategories?: string[]
    categories?: Category[]
}

export function ShopFilters({ validCategories, categories = [] }: ShopFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentCategory = searchParams.get("category")

    const handleCategoryChange = (slug: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (slug) {
            params.set("category", slug)
        } else {
            params.delete("category")
        }
        router.push(`/shop?${params.toString()}`)
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-lg font-semibold">Categories</h3>
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            !currentCategory && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => handleCategoryChange(null)}
                    >
                        All Watches
                    </Button>
                    {categories.filter(c => !validCategories || validCategories.includes(c.slug)).map((category) => (
                        <Button
                            key={category.slug}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start",
                                currentCategory === category.slug && "bg-accent text-accent-foreground"
                            )}
                            onClick={() => handleCategoryChange(category.slug)}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Price Filter Placeholder - Can be expanded later */}
            <div>
                <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>₹0</span>
                        <span>₹50,000+</span>
                    </div>
                    <input type="range" min="0" max="50000" className="w-full" disabled />
                    <p className="text-xs text-muted-foreground">Price filter coming soon</p>
                </div>
            </div>
        </div>
    )
}
