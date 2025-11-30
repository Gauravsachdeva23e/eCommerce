"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ShoppingBag, Menu, X, Search, User, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { CartDrawer } from "@/components/shop/CartDrawer"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isSearchOpen, setIsSearchOpen] = React.useState(false)
    const { totalItems, isCartOpen, openCart, closeCart } = useCart()
    const { scrollY } = useScroll()
    const pathname = usePathname()
    const router = useRouter()
    const { status } = useSession()
    const isHome = pathname === "/"
    const isAdmin = pathname?.startsWith("/admin")

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const query = formData.get("search") as string
        if (query.trim()) {
            router.push(`/shop?search=${encodeURIComponent(query)}`)
            setIsSearchOpen(false)
        }
    }

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    if (isAdmin) return null

    const isTransparent = isHome && !isScrolled

    return (
        <>
            <motion.header
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-300",
                    !isTransparent
                        ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-2"
                        : "bg-transparent py-4"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center space-x-2">
                                <span className={cn(
                                    "text-2xl font-bold tracking-tighter transition-colors",
                                    !isTransparent ? "text-primary" : "text-white md:text-white text-primary"
                                )}>
                                    SACHDEVA
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                            {["Home", "Shop", "About", "Contact"].map((item) => {
                                const href = item === "Home" ? "/" : `/${item.toLowerCase()}`
                                const isActive = pathname === href

                                return (
                                    <Link
                                        key={item}
                                        href={href}
                                        className={cn(
                                            "transition-colors relative group",
                                            !isTransparent
                                                ? (isActive ? "text-primary font-bold" : "text-foreground hover:text-primary")
                                                : (isActive ? "text-white font-bold" : "text-white/90 hover:text-white")
                                        )}
                                    >
                                        {item}
                                        <span className={cn(
                                            "absolute -bottom-1 left-0 h-0.5 transition-all group-hover:w-full",
                                            isActive ? "w-full" : "w-0",
                                            !isTransparent ? "bg-primary" : "bg-white"
                                        )} />
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {isSearchOpen ? (
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="h-9 w-48 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        autoFocus
                                        onBlur={() => setIsSearchOpen(false)}
                                        name="search"
                                    />
                                </form>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Search"
                                    className={cn(!isTransparent ? "text-foreground" : "text-white hover:bg-white/10")}
                                    onClick={() => setIsSearchOpen(true)}
                                >
                                    <Search className="h-5 w-5" />
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Cart"
                                className={cn("relative", !isTransparent ? "text-foreground" : "text-white hover:bg-white/10")}
                                onClick={openCart}
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Button>

                            {/* Auth Buttons */}
                            {status === "authenticated" ? (
                                <>
                                    <Link href="/profile">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Profile"
                                            className={cn(!isTransparent ? "text-foreground" : "text-white hover:bg-white/10")}
                                        >
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                </>
                            ) : status === "unauthenticated" ? (
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(!isTransparent ? "text-foreground" : "text-white hover:bg-white/10")}
                                    >
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Login
                                    </Button>
                                </Link>
                            ) : null}

                            {/* Mobile Menu Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("md:hidden", !isTransparent ? "text-foreground" : "text-white")}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="md:hidden border-t p-4 bg-background"
                    >
                        <nav className="flex flex-col space-y-4">
                            {["Home", "Shop", "About", "Contact"].map((item) => (
                                <Link
                                    key={item}
                                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                    className="text-sm font-medium hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </motion.header>
            <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
            {!isHome && !isAdmin && <div className="h-20" />}
        </>
    )
}
