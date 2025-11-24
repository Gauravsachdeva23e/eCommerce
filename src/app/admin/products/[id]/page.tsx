import { fetchProductById } from "@/app/actions"
import { ProductForm } from "@/components/admin/ProductForm"
import { notFound } from "next/navigation"
import { getSettings } from "@/lib/db"

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const product = await fetchProductById(params.id)
    const settings = await getSettings()

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
                <p className="text-muted-foreground">
                    Update product details.
                </p>
            </div>
            <ProductForm product={product} categories={settings.categories} />
        </div>
    )
}
