"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/ProductCard"
import { testimonials, Product, Review } from "@/lib/data"
import { Settings } from "@/lib/db"
import { ArrowRight, ShieldCheck, Truck, Clock, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface HomeClientProps {
    featuredProducts: Product[]
    pinnedReviews?: Review[]
    settings?: Settings
}

export function HomeClient({ featuredProducts, pinnedReviews = [], settings }: HomeClientProps) {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Default settings fallback
    const heroType = settings?.heroType || 'static'

    // Normalize slides to a common structure
    const defaultSlide = { type: 'image' as const, url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop" }

    const slides = heroType === 'static'
        ? [(settings?.staticMedia?.url ? settings.staticMedia : defaultSlide)]
        : (settings?.carouselSlides?.filter(s => s.url).length ? settings.carouselSlides.filter(s => s.url) : [defaultSlide])

    useEffect(() => {
        if (heroType === 'carousel' && slides.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length)
            }, 5000)
            return () => clearInterval(timer)
        }
    }, [heroType, slides.length])

    const currentMedia = slides[currentSlide] || defaultSlide

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        {currentMedia.type === 'video' ? (
                            <video
                                src={currentMedia.url}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="h-full w-full object-cover opacity-70"
                            />
                        ) : (
                            <Image
                                src={currentMedia.url || defaultSlide.url}
                                alt="Luxury Watch"
                                fill
                                className="object-cover brightness-[0.3]"
                                priority
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                <div
                    className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"
                    style={{ "--tw-gradient-from": settings?.gradientOverlayColor || "#ffa70040" } as React.CSSProperties}
                />

                <div className="container relative z-10 flex h-full flex-col justify-center px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-3xl space-y-6"
                    >
                        <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl whitespace-pre-line">
                            {settings?.heroHeading || "Timeless Elegance, Modern Precision."}
                        </h1>
                        <p className="max-w-[600px] text-lg text-gray-300 md:text-xl">
                            {settings?.heroSubheading || "Discover our curated collection of premium timepieces. Crafted for those who appreciate the finer moments in life."}
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-200 group relative overflow-hidden" asChild>
                                <Link href="/shop">
                                    <span className="transition-opacity duration-300 group-hover:opacity-0">{settings?.primaryButtonText || "Shop Collection"}</span>
                                    <ArrowRight className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white" asChild>
                                <Link href="/about">{settings?.secondaryButtonText || "Our Story"}</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24 bg-background">
                <div className="container px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Shop by Category</h2>
                        <p className="mt-4 text-muted-foreground">Find the perfect watch for every occasion.</p>
                    </motion.div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {settings?.categories?.filter(c => c.showOnHome).map((category, index) => (
                            <motion.div
                                key={category.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/shop?category=${category.slug}`} className="group relative block overflow-hidden rounded-2xl aspect-[4/5]">
                                    <Image
                                        src={category.image || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-8">
                                        <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                                        <p className="mt-2 text-sm text-gray-300 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                            Explore {category.name} Collection →
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-secondary/5">
                <div className="container px-4 md:px-6">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Timepieces</h2>
                            <p className="mt-4 text-muted-foreground">Our most coveted selections.</p>
                        </div>
                        <Button variant="ghost" className="hidden sm:flex" asChild>
                            <Link href="/shop">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center sm:hidden">
                        <Button variant="outline" asChild>
                            <Link href="/shop">View All Products</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-background">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-12 sm:grid-cols-3 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center space-y-4"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Authenticity Guaranteed</h3>
                            <p className="text-muted-foreground">Every timepiece is verified authentic and comes with original papers.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col items-center space-y-4"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Truck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Free Insured Shipping</h3>
                            <p className="text-muted-foreground">Complimentary shipping on all orders, fully insured for peace of mind.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center space-y-4"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Clock className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Lifetime Support</h3>
                            <p className="text-muted-foreground">Expert support and servicing available for the lifetime of your watch.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614164185128-e4899cae3038?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="container relative z-10 px-4 md:px-6">
                    <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                        Trusted by Collectors
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {pinnedReviews.length > 0 ? (
                            pinnedReviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-dark rounded-2xl p-8"
                                >
                                    <div className="mb-6 flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-lg italic text-gray-300">"{review.comment}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-secondary bg-muted flex items-center justify-center text-black font-bold text-xl">
                                            {review.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold">{review.userName}</p>
                                            <p className="text-sm text-gray-400">Verified Buyer</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-dark rounded-2xl p-8"
                                >
                                    <div className="mb-6 flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-lg italic text-gray-300">"{testimonial.content}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-secondary">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold">{testimonial.name}</p>
                                            <p className="text-sm text-gray-400">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
