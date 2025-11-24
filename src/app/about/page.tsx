"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            {/* Hero Section */}
            <div className="mb-16 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold tracking-tight text-primary md:text-5xl"
                >
                    Our Story
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-4 text-xl text-muted-foreground"
                >
                    Crafting timeless elegance since 1995.
                </motion.p>
            </div>

            {/* Content Sections */}
            <div className="space-y-24">
                <div className="grid gap-12 md:grid-cols-2 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold">A Legacy of Precision</h2>
                        <p className="text-lg text-muted-foreground">
                            Sachdeva Watches began with a simple vision: to bring world-class horology to the discerning Indian collector.
                            What started as a small boutique in New Delhi has grown into a premier destination for luxury timepieces.
                        </p>
                        <p className="text-lg text-muted-foreground">
                            We believe that a watch is more than just an instrument to tell time; it is a statement of character,
                            a piece of art, and an heirloom to be cherished for generations.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-video overflow-hidden rounded-xl shadow-2xl"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1596516109370-29001ec8ec36?q=80&w=2070&auto=format&fit=crop"
                            alt="Watchmaking Workshop"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>

                <div className="grid gap-12 md:grid-cols-2 items-center md:flex-row-reverse">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square overflow-hidden rounded-xl shadow-2xl md:order-2"
                    >
                        <Image
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="Founder"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 md:order-1"
                    >
                        <h2 className="text-3xl font-bold">Meet the Founder</h2>
                        <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground">
                            "I founded Sachdeva Watches with a passion for mechanics and beauty.
                            Every watch we sell is a piece I would be proud to wear myself."
                        </blockquote>
                        <p className="font-semibold text-lg">- Rajesh Sachdeva</p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
