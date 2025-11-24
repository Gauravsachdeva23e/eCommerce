import { fetchProductById, fetchProducts } from "@/app/actions"
import { ProductDetails } from "@/components/shop/ProductDetails"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProductPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const product = await fetchProductById(params.id)

    if (!product) {
        return (
            <div className="container mx-auto flex h-[50vh] flex-col items-center justify-center px-4">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Link href="/shop">
                    <Button className="mt-4">
                        Go Back to Shop
                    </Button>
                </Link>
            </div>
        )
    }

    const allProducts = await fetchProducts()
    const relatedProducts = allProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)

    return <ProductDetails product={product} relatedProducts={relatedProducts} />
}
