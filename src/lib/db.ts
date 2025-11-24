import fs from 'fs/promises';
import path from 'path';
import { Product } from './data';

export interface Order {
    id: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');

export async function getProducts(): Promise<Product[]> {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products:', error);
        return [];
    }
}

export async function saveProducts(products: Product[]): Promise<void> {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export async function getOrders() {
    try {
        const data = await fs.readFile(ORDERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading orders:', error);
        return [];
    }
}

export async function saveOrders(orders: any[]) {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function getCustomers() {
    try {
        const data = await fs.readFile(CUSTOMERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading customers:', error);
        return [];
    }
}

const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

export interface HeroSlide {
    type: 'image' | 'video';
    url: string;
}

export interface LinkItem {
    label: string;
    url: string;
}

export interface SocialLink {
    platform: 'facebook' | 'instagram' | 'twitter';
    url: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    showOnHome: boolean;
}

export interface Settings {
    heroType: 'static' | 'carousel';
    staticMedia: HeroSlide;
    carouselSlides: HeroSlide[];
    heroHeading: string;
    heroSubheading: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    gradientOverlayColor: string;
    footerShopLinks: LinkItem[];
    footerCompanyLinks: LinkItem[];
    footerSocialLinks: SocialLink[];
    footerAddress: string;
    footerPhone: string;
    footerEmail: string;
    categories: Category[];
}

export async function getSettings(): Promise<Settings> {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        const parsed = JSON.parse(data);

        // Migration/Fallback for old data structure
        if (!parsed.staticMedia) {
            parsed.staticMedia = {
                type: 'image',
                url: parsed.heroImage || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
            };
        }
        if (!parsed.carouselSlides) {
            parsed.carouselSlides = parsed.carouselImages
                ? parsed.carouselImages.map((url: string) => ({ type: 'image', url }))
                : [];
        }
        if (!parsed.categories) {
            parsed.categories = [
                {
                    id: "1",
                    name: "Men's Watches",
                    slug: "men",
                    image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=2070&auto=format&fit=crop",
                    showOnHome: true
                },
                {
                    id: "2",
                    name: "Women's Watches",
                    slug: "women",
                    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=2027&auto=format&fit=crop",
                    showOnHome: true
                },
                {
                    id: "3",
                    name: "New Arrivals",
                    slug: "new",
                    image: "https://images.unsplash.com/photo-1495856458515-0637185db551?q=80&w=2070&auto=format&fit=crop",
                    showOnHome: true
                }
            ];
        }

        return parsed;
    } catch (error) {
        // Default settings
        return {
            heroType: 'static',
            staticMedia: {
                type: 'image',
                url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
            },
            carouselSlides: [],
            heroHeading: "Timeless Elegance, Modern Precision.",
            heroSubheading: "Discover our curated collection of premium timepieces. Crafted for those who appreciate the finer moments in life.",
            primaryButtonText: "Shop Collection",
            secondaryButtonText: "Our Story",
            gradientOverlayColor: "#ffa70040",
            footerShopLinks: [
                { label: "Men's Watches", url: "/shop?category=men" },
                { label: "Women's Watches", url: "/shop?category=women" },
                { label: "New Arrivals", url: "/shop?category=new" },
                { label: "Best Sellers", url: "/shop?category=bestsellers" }
            ],
            footerCompanyLinks: [
                { label: "About Us", url: "/about" },
                { label: "Contact", url: "/contact" },
                { label: "FAQ", url: "/faq" },
                { label: "Privacy Policy", url: "/legal" }
            ],
            footerSocialLinks: [
                { platform: "facebook", url: "#" },
                { platform: "instagram", url: "#" },
                { platform: "twitter", url: "#" }
            ],
            footerAddress: "123 Watch Street\nNew Delhi, India 110001",
            footerPhone: "+91 98765 43210",
            footerEmail: "support@sachdevawatches.com",
            categories: [
                {
                    id: "1",
                    name: "Men's Watches",
                    slug: "men",
                    image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=2070&auto=format&fit=crop",
                    showOnHome: true
                },
                {
                    id: "2",
                    name: "Women's Watches",
                    slug: "women",
                    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=2027&auto=format&fit=crop",
                    showOnHome: true
                },
                {
                    id: "3",
                    name: "New Arrivals",
                    slug: "new",
                    image: "https://images.unsplash.com/photo-1495856458515-0637185db551?q=80&w=2070&auto=format&fit=crop",
                    showOnHome: true
                }
            ]
        };
    }
}

export async function saveSettings(settings: Settings) {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

const PAYMENT_SETTINGS_FILE = path.join(DATA_DIR, 'payment_settings.json');

export interface PaymentSettings {
    mode: 'sandbox' | 'live';
    sandbox_client_id: string;
    sandbox_client_secret: string;
    live_client_id: string;
    live_client_secret: string;
    callback_url: string;
    webhook_url: string;
    updated_at: string;
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
    try {
        const data = await fs.readFile(PAYMENT_SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Default settings
        return {
            mode: 'sandbox',
            sandbox_client_id: '',
            sandbox_client_secret: '',
            live_client_id: '',
            live_client_secret: '',
            callback_url: 'http://localhost:3000/checkout/success',
            webhook_url: 'http://localhost:3000/api/webhook/cashfree',
            updated_at: new Date().toISOString()
        };
    }
}

export async function savePaymentSettings(settings: PaymentSettings) {
    await fs.writeFile(PAYMENT_SETTINGS_FILE, JSON.stringify(settings, null, 2));
}
