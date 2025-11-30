"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { ShoppingBag, Truck, ShieldCheck, ArrowLeft } from "lucide-react"
import { ProductCard } from "@/components/shop/ProductCard"
import { ProductReviews } from "@/components/shop/ProductReviews"
import { Product } from "@/lib/data"

interface ProductDetailsProps {
    product: Product
    relatedProducts: Product[]
}

export function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
    const router = useRouter()
    const { addItem } = useCart()

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <Button variant="ghost" className="mb-8 gap-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {product.category}
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                            {product.name}
                        </h1>
                    </div>

                    <div className="text-2xl font-bold text-primary">
                        ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    <p className="text-muted-foreground md:text-lg">
                        {product.description}
                    </p>

                    <div className="space-y-4 rounded-lg border p-4">
                        <h3 className="font-semibold">Key Features</h3>
                        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                            {product.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button size="lg" className="flex-1 gap-2" onClick={() => addItem(product)} data-testid="add-to-cart-button">
                            <ShoppingBag className="h-5 w-5" />
                            Add to Cart
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Truck className="h-5 w-5 text-primary" />
                            <span>Free Shipping</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <span>2 Year Warranty</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="mt-16 border-t pt-16">
                <ProductReviews productId={product.id} reviews={product.reviews || []} />
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-24">
                    <h2 className="mb-8 text-2xl font-bold tracking-tight">
                        You May Also Like
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
