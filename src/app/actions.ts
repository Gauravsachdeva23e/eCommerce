'use server'

import { getProducts, saveProducts, getOrders, saveOrders, getCustomers, getSettings, saveSettings, Settings } from '@/lib/db';
import { Product } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function initiatePayment(amount: number, customerData: any, items: any[]) {
    console.log("Initiating payment for:", amount);
    const orderId = "ORDER_" + Date.now();

    // Save order to DB first
    await createOrder({
        id: orderId,
        total: amount,
        customer: customerData,
        items: items,
        status: 'Pending',
        paymentStatus: 'pending'
    });

    const url = "https://sandbox.cashfree.com/pg/orders";
    const headers = {
        "x-client-id": "",
        "x-client-secret": "",
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
    };
    const body = {
        order_amount: amount,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
            customer_id: customerData.id || "guest_" + Date.now(),
            customer_name: customerData.name || "Guest",
            customer_email: customerData.email || "guest@example.com",
            customer_phone: customerData.phone || "9999999999"
        },
        order_meta: {
            return_url: "http://localhost:3000/checkout/success?order_id={order_id}"
        }
    };

    try {
        console.log("Calling Cashfree API...", url);
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log("Cashfree API Response:", data);

        if (response.ok) {
            return { success: true, payment_session_id: data.payment_session_id, order_id: data.order_id };
        } else {
            console.error("Cashfree API Error:", data);
            return { success: false, error: data.message || "API Error" };
        }
    } catch (error: any) {
        console.error("Fetch Error:", error);
        return { success: false, error: error.message };
    }
}

export async function fetchProducts() {
    return await getProducts();
}

export async function fetchProductById(id: string) {
    const products = await getProducts();
    return products.find((p) => p.id === id);
}

export async function updateProduct(updatedProduct: Product) {
    const products = await getProducts();
    const index = products.findIndex((p) => p.id === updatedProduct.id);

    if (index !== -1) {
        products[index] = updatedProduct;
        await saveProducts(products);
        revalidatePath('/shop');
        revalidatePath(`/shop/${updatedProduct.id}`);
        revalidatePath('/admin/products');
        return { success: true };
    }
    return { success: false, error: 'Product not found' };
}

export async function createProduct(newProduct: Product) {
    const products = await getProducts();
    products.push(newProduct);
    await saveProducts(products);
    revalidatePath('/shop');
    revalidatePath('/admin/products');
    return { success: true };
}

export async function fetchMetrics() {
    const orders = await getOrders();

    const totalRevenue = orders.reduce((acc: number, order: any) => acc + order.total, 0);
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter((order: any) => order.date === today).length;
    const monthlyOrders = orders.length; // Simplified for mock
    // Randomize return rate between 1.5% and 3.5% for demo purposes
    const returnRate = (Math.random() * (3.5 - 1.5) + 1.5).toFixed(1) + "%";

    return {
        totalRevenue,
        todaysOrders,
        monthlyOrders,
        returnRate
    };
}

export async function fetchOrders() {
    return await getOrders();
}

export async function fetchCustomers() {
    return await getCustomers();
}

export async function createOrder(orderData: any) {
    try {
        const orders = await getOrders();
        const newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            ...orderData
        };
        orders.unshift(newOrder); // Add to beginning
        await import('@/lib/db').then(mod => mod.saveOrders(orders));

        revalidatePath('/admin');
        return { success: true, orderId: newOrder.id };
    } catch (error) {
        console.error('Failed to create order:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

export async function submitReview(data: { productId: string; userName: string; rating: number; comment: string }) {
    const products = await getProducts();
    const productIndex = products.findIndex(p => p.id === data.productId);

    if (productIndex === -1) throw new Error("Product not found");

    const newReview: any = {
        id: Math.random().toString(36).substr(2, 9),
        productId: data.productId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        date: new Date().toISOString(),
        status: 'pending' // Default status
    };

    if (!products[productIndex].reviews) {
        products[productIndex].reviews = [];
    }

    products[productIndex].reviews?.push(newReview);
    await saveProducts(products);
    revalidatePath(`/product/${data.productId}`);
    revalidatePath('/admin/reviews');
    return { success: true };
}

export async function updateReviewStatus(productId: string, reviewId: string, status: 'approved' | 'rejected') {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    if (!product || !product.reviews) return { success: false };

    const review = product.reviews.find(r => r.id === reviewId);
    if (review) {
        review.status = status;
        await saveProducts(products);
        revalidatePath(`/product/${productId}`);
        revalidatePath('/admin/reviews');
        return { success: true };
    }
    return { success: false };
}

export async function replyToReview(productId: string, reviewId: string, reply: string) {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    if (!product || !product.reviews) return { success: false };

    const review = product.reviews.find(r => r.id === reviewId);
    if (review) {
        review.reply = reply;
        await saveProducts(products);
        revalidatePath(`/product/${productId}`);
        revalidatePath('/admin/reviews');
        return { success: true };
    }
    return { success: false };
}

export async function deleteReview(productId: string, reviewId: string) {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    if (!product || !product.reviews) return { success: false };

    product.reviews = product.reviews.filter(r => r.id !== reviewId);
    await saveProducts(products);
    revalidatePath(`/product/${productId}`);
    revalidatePath('/admin/reviews');
    return { success: true };
}

export async function togglePinReview(productId: string, reviewId: string) {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    if (!product || !product.reviews) return { success: false };

    const review = product.reviews.find(r => r.id === reviewId);
    if (review) {
        review.isPinned = !review.isPinned;
        await saveProducts(products);
        revalidatePath('/'); // Revalidate home page as pinned reviews might show there
        revalidatePath('/admin/reviews');
        return { success: true };
    }
    return { success: false };
}

export async function updateProductStatus(productId: string, status: 'active' | 'draft' | 'archived' | 'out_of_stock') {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
        product.status = status;
        await saveProducts(products);
        revalidatePath('/shop');
        revalidatePath('/admin/products');
        return { success: true };
    }
    return { success: false };
}

export async function deleteProduct(productId: string) {
    const products = await getProducts();
    const newProducts = products.filter(p => p.id !== productId);
    await saveProducts(newProducts);
    revalidatePath('/shop');
    revalidatePath('/admin/products');
    return { success: true };
}

export async function updateOrderStatus(orderId: string, status: string) {
    const orders = await getOrders();
    const order = orders.find((o: any) => o.id === orderId);
    if (order) {
        order.status = status;
        await saveOrders(orders);
        revalidatePath('/admin/orders');
        return { success: true };
    }
    return { success: false };
}

export async function fetchSettings() {
    return await getSettings();
}

export async function updateSettings(settings: Settings) {
    await saveSettings(settings);
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/settings');
    return { success: true };
}

export async function uploadMedia(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        return { success: false, error: 'No file uploaded' };
    }

    // Validation Constants
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB for videos
    const ALLOWED_TYPES = [
        'image/jpeg', 'image/png', 'image/webp',
        'video/mp4', 'video/webm'
    ];

    // Validate Size
    if (file.size > MAX_SIZE) {
        return { success: false, error: 'File size exceeds 50MB limit' };
    }
    if (file.size === 0) {
        return { success: false, error: 'File is empty' };
    }

    // Validate Type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, MP4, and WEBM are allowed.' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + '.' + file.name.split('.').pop();

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return { success: true, url: `/uploads/${filename}`, type: file.type.startsWith('video/') ? 'video' : 'image' };
}
