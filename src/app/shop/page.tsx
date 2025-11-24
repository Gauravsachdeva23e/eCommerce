import { Suspense } from "react"
import { ProductCard } from "@/components/shop/ProductCard"
import { ShopFilters } from "@/components/shop/ShopFilters"
import { fetchProducts } from "@/app/actions"
import { getSettings } from "@/lib/db"

// This is a Server Component
export default async function ShopPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const category = searchParams.category
    const search = searchParams.search
    const products = await fetchProducts()
    const settings = await getSettings()

    let filteredProducts = products

    // Filter by Search
    if (search && typeof search === "string") {
        const query = search.toLowerCase()
        filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        )
    }

    // Filter by Category
    if (category && typeof category === "string") {
        filteredProducts = filteredProducts.filter(
            (product) => product.category.toLowerCase() === category.toLowerCase() ||
                (category === 'new' && product.isNew) ||
                (category === 'men' && product.category === 'Men') ||
                (category === 'women' && product.category === 'Women')
        )
    }

    // Calculate valid categories (only those with products)
    // We check against ALL products to determine if a category should be visible in the sidebar
    // regardless of current search/filter
    const validCategories = new Set<string>()
    products.forEach(product => {
        validCategories.add(product.category.toLowerCase())
        if (product.isNew) validCategories.add('new')
    })
    // Ensure mapped categories like 'Men' -> 'men' are handled
    // The data.ts categories have slugs: 'men', 'women', 'new'
    // Product categories are 'Men', 'Women', 'Unisex', 'Kids'
    // We need to map them correctly.
    // Actually, let's just check if any product matches the category logic
    // We want to show all categories in the sidebar, even if they are empty,
    // so that users can see the category structure they created.
    const activeCategorySlugs = settings.categories.map(c => c.slug)

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Shop</h1>
                <p className="text-muted-foreground">
                    Explore our collection of premium timepieces.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                {/* Sidebar Filters */}
                <aside className="hidden md:block">
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <ShopFilters validCategories={activeCategorySlugs} categories={settings.categories} />
                    </Suspense>
                </aside>

                {/* Product Grid */}
                <div className="md:col-span-3">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                No watches found {search ? `matching "${search}"` : "in this category"}.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
