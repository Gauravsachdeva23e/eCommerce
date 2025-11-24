export interface Review {
    id: string
    productId: string
    userName: string
    rating: number
    comment: string
    date: string
    status: 'pending' | 'approved' | 'rejected'
    reply?: string
    isPinned?: boolean
}

export interface Product {
    id: string
    name: string
    price: number
    description: string
    image: string
    category: string
    features: string[]
    isFeatured?: boolean
    isNew?: boolean
    reviews?: Review[]
    status?: 'active' | 'draft' | 'archived' | 'out_of_stock'
}

export const products: Product[] = [
    {
        id: "1",
        name: "The Royal Chronograph",
        price: 12999,
        description: "A masterpiece of engineering and design. The Royal Chronograph features a precision automatic movement encased in surgical-grade stainless steel.",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop",
        category: "Men",
        features: ["Automatic Movement", "Sapphire Crystal", "Water Resistant 100m"],
        isFeatured: true,
    },
    {
        id: "2",
        name: "Elegance Rose Gold",
        price: 8999,
        description: "Timeless elegance for the modern woman. Rose gold plating meets a minimalist dial for a look that transcends trends.",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1927&auto=format&fit=crop",
        category: "Women",
        features: ["Quartz Movement", "Rose Gold Plated", "Genuine Leather Strap"],
        isFeatured: true,
    },
    {
        id: "3",
        name: "The Aviator Series",
        price: 15499,
        description: "Inspired by classic aviation instruments. Bold, legible, and built to withstand the rigors of flight.",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop",
        category: "Men",
        features: ["Chronograph Function", "Luminous Hands", "Titanium Case"],
        isNew: true,
    },
    {
        id: "4",
        name: "Classic Minimalist",
        price: 5999,
        description: "Less is more. A clean design that pairs perfectly with both formal wear and casual attire.",
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1988&auto=format&fit=crop",
        category: "Unisex",
        features: ["Slim Profile", "Interchangeable Straps", "Mineral Glass"],
    },
    {
        id: "5",
        name: "Diver Pro 300",
        price: 18999,
        description: "Professional grade diving watch. Built for the depths, styled for the surface.",
        image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=2030&auto=format&fit=crop",
        category: "Men",
        features: ["300m Water Resistance", "Rotating Bezel", "Helium Escape Valve"],
        isFeatured: true,
    },
    {
        id: "6",
        name: "Stellar Diamond",
        price: 24999,
        description: "A touch of luxury. Genuine diamond markers set against a mother-of-pearl dial.",
        image: "https://images.unsplash.com/photo-1595923533867-87875cb21562?q=80&w=2070&auto=format&fit=crop",
        category: "Women",
        features: ["Diamond Markers", "Mother of Pearl Dial", "Swiss Quartz"],
    },
]

export const categories = [
    {
        name: "Men's Watches",
        image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=2070&auto=format&fit=crop",
        slug: "men",
    },
    {
        name: "Women's Watches",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=2027&auto=format&fit=crop",
        slug: "women",
    },
    {
        name: "New Arrivals",
        image: "https://images.unsplash.com/photo-1495856458515-0637185db551?q=80&w=2070&auto=format&fit=crop",
        slug: "new",
    },
]

export const testimonials = [
    {
        id: 1,
        name: "Rajesh Kumar",
        role: "CEO, TechCorp",
        content: "The quality of the Royal Chronograph is unmatched at this price point. Truly a premium experience.",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Fashion Designer",
        content: "I love my Elegance Rose Gold. It's become my daily driver. The design is simply stunning.",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
        id: 3,
        name: "Amit Patel",
        role: "Architect",
        content: "Sachdeva Watches delivers on their promise of elegance and precision. Highly recommended.",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
]
