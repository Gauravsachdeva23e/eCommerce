"use client"

import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Eye } from "lucide-react"
import { motion } from "framer-motion"

import { useCart } from "@/context/CartContext"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const fallbackImage = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
  const imageSrc = product.image && product.image.trim() !== "" ? product.image : fallbackImage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-xl"
    >
      <Link href={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-muted relative">
        <Image
          src={imageSrc}
          alt={product.name}
          width={500}
          height={500}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
          <Button variant="secondary" size="sm" className="gap-2 pointer-events-none">
            <Eye className="h-4 w-4" /> View Details
          </Button>
        </div>
      </Link>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
          <p className="font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-3 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-secondary">
            {product.name}
          </h3>
        </Link>
        <Button
          size="sm"
          className="w-full gap-2 transition-transform active:scale-95"
          onClick={(e) => {
            e.preventDefault()
            addItem(product)
          }}
          data-testid={`add-to-cart-${product.id}`}
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  )
}
