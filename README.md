# Sachdeva Watches - Premium E-commerce Platform

A modern, full-featured e-commerce application built with Next.js 16, TypeScript, and Tailwind CSS. This platform is designed for selling premium watches but can be adapted for any product line. It features a sleek public storefront and a comprehensive admin panel for store management.

## 🚀 Features

### 🛍️ Public Storefront
*   **Modern UI/UX**: Responsive design with a premium aesthetic, featuring dark/light mode support.
*   **Product Browsing**: Browse products by category (Men, Women, New Arrivals) with detailed product pages.
*   **Shopping Cart**: Fully functional cart with "Add to Cart", quantity adjustment, and removal features.
*   **Checkout Integration**: Integrated with **Cashfree Payment Gateway** for secure transactions.
*   **Product Reviews**: Users can leave reviews and ratings on products.

### 👨‍💻 Admin Panel
*   **Dashboard**: Real-time metrics including Total Revenue, Today's Orders, Monthly Orders, and Return Rate.
*   **Product Management**: Create, read, update, and delete (CRUD) products. Manage inventory status (Active, Out of Stock, etc.).
*   **Order Management**: View all customer orders, track status (Pending, Shipped, Delivered), and view payment details.
*   **Review Management**: Moderation system to Approve, Reject, Delete, or Reply to customer reviews. Pin top reviews to the homepage.
*   **Settings Configuration**:
    *   **General**: Customize Hero section (Image/Video), headings, and buttons.
    *   **Footer**: Manage footer links and contact information.
    *   **Payment**: Securely configure Cashfree API keys (Sandbox/Live) and toggle environments without code changes.

## 🛠️ Technology Stack
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components.
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Payment**: [Cashfree SDK](https://docs.cashfree.com/)
*   **Data Storage**: JSON-based file storage (located in `src/data`) for easy setup and portability (can be replaced with a DB like Postgres/MongoDB).
*   **Security**: AES-256-GCM encryption for sensitive API keys.

## 📋 Prerequisites
*   **Node.js**: Version 18.17 or later.
*   **npm**: Installed with Node.js.

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Gauravsachdeva23e/eCommerce.git
    cd eCommerce
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory to store your encryption key. This key is used to secure your payment gateway credentials.

    ```env
    # Must be exactly 32 characters long
    ENCRYPTION_KEY=your-32-char-random-string-here
    ```
    *Tip: You can generate a key using `openssl rand -hex 16` in your terminal.*

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Admin Access
The admin panel is protected by a basic authentication layer.
1.  Navigate to **[http://localhost:3000/login](http://localhost:3000/login)**.
2.  Enter the password: **`admin123`** (Default).
3.  You will be redirected to the Admin Dashboard.

### Configuring Payments
1.  Log in to the Admin Panel.
2.  Go to **Settings** > **Payment** tab.
3.  Select your mode (**Sandbox** for testing, **Live** for production).
4.  Enter your Cashfree **App ID** and **Secret Key**.
5.  Click **Save Settings**.
    *   *Note: Keys are encrypted before storage.*

### Managing Content
*   **Products**: Go to the **Products** tab to add new watches or edit existing ones. You can upload images and set prices.
*   **Reviews**: Check the **Reviews** tab to moderate user feedback.
*   **Site Content**: Use **Settings > General** to update the homepage banner and text.

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── admin/           # Admin panel pages
│   ├── api/             # Backend API endpoints (payment, webhooks)
│   ├── login/           # Admin login page
│   ├── shop/            # Public shop pages
│   └── ...
├── components/          # Reusable React components
│   ├── admin/           # Admin-specific components
│   ├── shop/            # Storefront components
│   └── ui/              # shadcn/ui primitive components
├── lib/                 # Utility functions
│   ├── db.ts            # File-based database logic
│   ├── encryption.ts    # Security utilities
│   └── payment.ts       # Cashfree integration logic
└── data/                # JSON data files (products, orders, settings)
```
