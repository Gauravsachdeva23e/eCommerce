'use server'

import { getProducts, saveProducts, getOrders, saveOrders, getCustomers, getSettings, saveSettings, Settings } from '@/lib/db';
import { Product } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getActiveCashfreeConfig } from '@/lib/payment';
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { ShiprocketService } from "@/lib/shiprocket-service"

export async function initiatePayment(amount: number, customerData: any, items: any[]) {
    console.log("Initiating payment for:", amount);

    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Not authenticated" }

        // Create Order in DB (Prisma)
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                total: amount,
                subTotal: amount,
                tax: 0,
                shippingCharges: 0,
                discount: 0,
                status: "PENDING",
                paymentStatus: "PENDING",
                paymentMethod: "PREPAID",
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    }))
                }
            }
        })

        const orderId = order.id;

        const config = await getActiveCashfreeConfig();
        const url = `${config.baseUrl}/orders`;
        const headers = {
            "x-client-id": config.clientId,
            "x-client-secret": config.clientSecret,
            "x-api-version": config.apiVersion,
            "Content-Type": "application/json"
        };

        const body = {
            order_amount: amount,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: session.user.id,
                customer_name: customerData.name || session.user.name || "Guest",
                customer_email: customerData.email || "guest@example.com",
                customer_phone: customerData.phone || "9999999999"
            },
            order_meta: {
                return_url: `${config.callbackUrl}?order_id={order_id}`
            }
        };

        console.log("Calling Cashfree API...", url);
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log("Cashfree API Response:", data);

        if (response.ok) {
            return {
                success: true,
                payment_session_id: data.payment_session_id,
                order_id: data.order_id,
                mode: config.baseUrl.includes("sandbox") ? "sandbox" : "production"
            };
        } else {
            console.error("Cashfree API Error:", data);
            return { success: false, error: data.message || "API Error" };
        }
    } catch (error: any) {
        console.error("Payment Initiation Error:", error);
        return { success: false, error: error.message || "Payment Initiation Failed" };
    }
}

export async function verifyPayment(orderId: string) {
    const config = await getActiveCashfreeConfig();
    const url = `${config.baseUrl}/orders/${orderId}`;
    const headers = {
        "x-client-id": config.clientId,
        "x-client-secret": config.clientSecret,
        "x-api-version": config.apiVersion
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();

        if (data.order_status === "PAID") {
            // Update order status in DB
            await prisma.order.update({
                where: { id: orderId },
                data: { status: "PAID", paymentStatus: "PAID" }
            });

            // Trigger Shiprocket Order Creation
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true, user: true }
            });

            if (order) {
                // Fetch user's default or most recent address
                const address = await prisma.address.findFirst({
                    where: { userId: order.userId },
                    orderBy: { updatedAt: 'desc' }
                });

                if (address) {
                    const srOrderData = {
                        order_id: order.id,
                        order_date: order.createdAt.toISOString(),
                        pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION_ID || "Primary",
                        billing_customer_name: order.user.name || "Customer",
                        billing_last_name: "",
                        billing_address: address.houseNumber + ", " + address.locality,
                        billing_city: address.city,
                        billing_pincode: address.pincode,
                        billing_state: address.state,
                        billing_country: "India",
                        billing_email: "user@example.com", // Placeholder
                        billing_phone: (order.user as any).phone || "9876543210",
                        shipping_is_billing: true,
                        order_items: order.items.map((item: any) => ({
                            name: item.name,
                            sku: item.productId,
                            units: item.quantity,
                            selling_price: item.price,
                            discount: 0,
                            tax: 0,
                            hsn: 0
                        })),
                        payment_method: "Prepaid",
                        sub_total: order.total,
                        length: 10, breadth: 10, height: 10, weight: 0.5 // Default dimensions
                    };

                    try {
                        const srResponse = await ShiprocketService.createOrder(srOrderData);

                        await prisma.shiprocketOrder.create({
                            data: {
                                orderId: order.id,
                                shiprocketOrderId: srResponse.order_id,
                                shipmentId: srResponse.shipment_id,
                                status: srResponse.status,
                                courierName: srResponse.courier_name,
                                awbCode: srResponse.awb_code
                            }
                        });
                    } catch (srError) {
                        console.error("Shiprocket Creation Failed:", srError);
                        // Don't fail the verification if shipping fails, but log it
                    }
                }
            }

            return { success: true };
        } else {
            return { success: false, error: "Payment not verified" };
        }
    } catch (error) {
        console.error("Verification Error:", error);
        return { success: false, error: "Verification failed" };
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
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return orders.map(order => ({
        id: order.id,
        customer: order.user ? { name: order.user.name || 'Unknown' } : 'Guest',
        date: order.createdAt.toISOString().split('T')[0],
        status: order.status,
        total: order.total,
        items: order.items
    }))
}

export async function fetchCustomers() {
    const users = await prisma.user.findMany({
        include: {
            orders: {
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return users.map(user => {
        const totalSpent = user.orders.reduce((acc, order) => acc + order.total, 0)
        const lastOrder = user.orders[0]?.createdAt.toISOString().split('T')[0] || 'Never'

        return {
            id: user.id,
            name: user.name || 'Unknown',
            email: user.phone, // Using phone as email/identifier for now
            orders: user.orders.length,
            totalSpent,
            lastOrder
        }
    })
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

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        return { success: false, error: 'No file uploaded' };
    }

    // Validation Constants
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    // Validate Size
    if (file.size > MAX_SIZE) {
        return { success: false, error: 'File size exceeds 5MB limit' };
    }
    if (file.size === 0) {
        return { success: false, error: 'File is empty' };
    }

    // Validate Type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { success: false, error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' };
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

    return { success: true, url: `/uploads/${filename}` };
}

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string

    if (!name || !phone || !password) {
        return { success: false, error: "Missing fields" }
    }

    // Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    if (!passwordRegex.test(password)) {
        return {
            success: false,
            error: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        }
    }

    // Check if user exists
    console.log("Checking if user exists:", phone)
    const existingUser = await prisma.user.findUnique({ where: { phone } })
    if (existingUser) {
        console.log("User already exists")
        return { success: false, error: "User already exists" }
    }

    // Hash password
    console.log("Hashing password")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    console.log("Creating user")
    try {
        await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
            },
        })
        console.log("User created successfully")
    } catch (e) {
        console.error("Error creating user:", e)
        return { success: false, error: "Database error" }
    }

    return { success: true }
}

export async function addAddress(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "Not authenticated" }

    const houseNumber = formData.get("houseNumber") as string
    const locality = formData.get("locality") as string
    const landmark = formData.get("landmark") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const pincode = formData.get("pincode") as string

    // Validation
    if (!houseNumber || !locality || !city || !state || !pincode) {
        return { success: false, error: "Missing required fields" }
    }
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
        return { success: false, error: "Invalid Pincode" }
    }

    try {
        await prisma.address.create({
            data: {
                userId: session.user.id,
                houseNumber,
                locality,
                landmark,
                city,
                state,
                pincode,
            },
        })
        revalidatePath("/profile")
        return { success: true }
    } catch (error) {
        console.error("Error adding address:", error)
        return { success: false, error: "Failed to save address" }
    }
}

export async function deleteAddress(addressId: string) {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "Not authenticated" }

    const address = await prisma.address.findUnique({ where: { id: addressId } })
    if (!address || address.userId !== session.user.id) {
        return { success: false, error: "Address not found" }
    }

    await prisma.address.delete({ where: { id: addressId } })
    revalidatePath("/profile")
    return { success: true }
}

export async function getShiprocketToken() {
    const setting = await prisma.systemSetting.findUnique({
        where: { key: 'shiprocket_token' }
    })
    return setting?.value || ''
}

export async function updateShiprocketToken(token: string) {
    const session = await auth()
    if (!session?.user) return { success: false, error: "Not authenticated" }

    await prisma.systemSetting.upsert({
        where: { key: 'shiprocket_token' },
        update: { value: token },
        create: { key: 'shiprocket_token', value: token, description: 'Shiprocket Bearer Token' }
    })
    revalidatePath("/admin/settings")
    return { success: true }
}

export async function placeOrder(orderData: { items: any[], addressId: string, total: number }) {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "Not authenticated" }

    const { items, addressId, total } = orderData

    // Fetch address
    const address = await prisma.address.findUnique({ where: { id: addressId } })
    if (!address) return { success: false, error: "Address not found" }

    // Create Order in DB
    const order = await prisma.order.create({
        data: {
            userId: session.user.id,
            total,
            subTotal: total, // Simplified
            tax: 0,
            shippingCharges: 0,
            discount: 0,
            status: "PENDING",
            items: {
                create: items.map((item: any) => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                }))
            }
        }
    })

    // Prepare Shiprocket Data
    const srOrderData = {
        order_id: order.id,
        order_date: order.createdAt.toISOString(),
        pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION_ID || "Primary",
        billing_customer_name: session.user.name || "Customer",
        billing_last_name: "",
        billing_address: address.houseNumber + ", " + address.locality,
        billing_city: address.city,
        billing_pincode: address.pincode,
        billing_state: address.state,
        billing_country: "India",
        billing_email: "user@example.com", // Placeholder
        billing_phone: (session.user as any).phone || "9876543210",
        shipping_is_billing: true,
        order_items: items.map((item: any) => ({
            name: item.name,
            sku: item.id,
            units: item.quantity,
            selling_price: item.price,
            discount: 0,
            tax: 0,
            hsn: 0
        })),
        payment_method: "COD",
        sub_total: total,
        length: 10, breadth: 10, height: 10, weight: 0.5 // Default dimensions
    }

    // Call Shiprocket
    try {
        const srResponse = await ShiprocketService.createOrder(srOrderData)

        // Save Shiprocket details
        await prisma.shiprocketOrder.create({
            data: {
                orderId: order.id,
                shiprocketOrderId: srResponse.order_id,
                shipmentId: srResponse.shipment_id,
                status: srResponse.status,
                courierName: srResponse.courier_name,
                awbCode: srResponse.awb_code
            }
        })

        return { success: true, orderId: order.id }
    } catch (error) {
        console.error("Shiprocket Error:", error)
        return { success: true, orderId: order.id, warning: "Order placed but shipping generation failed" }
    }
}
