import { HomeClient } from "@/components/home/HomeClient"
import { fetchProducts, fetchSettings } from "@/app/actions"

export default async function Home() {
  const allProducts = await fetchProducts()
  const settings = await fetchSettings()
  const featuredProducts = allProducts.filter((p) => p.isFeatured)

  const pinnedReviews = allProducts
    .flatMap(p => p.reviews || [])
    .filter(r => r.isPinned)
    .slice(0, 3) // Limit to 3 for layout

  return <HomeClient featuredProducts={featuredProducts} pinnedReviews={pinnedReviews} settings={settings} />
}
