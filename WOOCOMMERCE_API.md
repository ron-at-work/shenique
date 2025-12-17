# WooCommerce API Integration Guide

This document explains how to use the WooCommerce REST API integration in this Next.js application.

## Setup

### Step 1: Create Environment File

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://shenique.in
NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY=your_consumer_key_here
NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET=your_consumer_secret_here
```

**Important Notes:**
- Replace `https://shenique.in` with your actual WordPress/WooCommerce site URL (without trailing slash)
- The URL should start with `http://` or `https://`

### Step 2: Get WooCommerce API Credentials

1. Log in to your WordPress Admin panel
2. Go to: **WooCommerce → Settings → Advanced → REST API**
3. Click **Add Key** button
4. Fill in:
   - **Description**: e.g., "Next.js Frontend"
   - **User**: Select an admin user
   - **Permissions**: Select **Read/Write** (or at least **Read** for frontend)
5. Click **Generate API Key**
6. Copy the **Consumer Key** and **Consumer Secret**
7. Paste them into your `.env.local` file

### Step 3: Restart Your Server (IMPORTANT!)

**⚠️ CRITICAL:** After creating or updating your `.env.local` file, you MUST restart your Next.js development server for the changes to take effect.

```bash
# Stop the current server (Ctrl+C)
# Then restart it:
npm run dev
```

**Why?** Next.js only reads environment variables when the server starts. If you don't restart, it will continue using old values or default to localhost.

The application will automatically fetch products, categories, and other data from your WooCommerce store.

### Troubleshooting

**If the API base URL is showing localhost:3000 instead of your WordPress URL:**

1. **Check your `.env.local` file exists** in the root directory (same level as `package.json`)
2. **Verify the variable names are correct:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://shenique.in
   NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY=your_key_here
   NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET=your_secret_here
   ```
3. **RESTART YOUR SERVER** - This is the most common issue! Next.js only reads `.env.local` when it starts.
   ```bash
   # Stop server (Ctrl+C) and restart:
   npm run dev
   ```
4. **Check for typos** - Make sure there are no spaces around the `=` sign
5. **Verify the URL format** - Should start with `http://` or `https://` and NOT end with a slash
6. **Check server console** - Look for error messages about missing environment variables
7. **Verify your WooCommerce site is accessible** - Try opening `https://shenique.in/wp-json/wc/v3/` in your browser

**Other common issues:**
- Make sure your `.env.local` file is NOT committed to git (it should be in `.gitignore`)
- Verify that the API credentials are correct
- Ensure your WooCommerce site has REST API enabled
- Check browser console and server logs for specific error messages

## API Routes

All WooCommerce API endpoints are available through Next.js API routes at `/api/woocommerce/`.

### Products

#### Get All Products
```typescript
GET /api/woocommerce/products
// Query params: per_page, page, search, category, etc.
```

#### Get Product by ID
```typescript
GET /api/woocommerce/products?id=123
// or
GET /api/woocommerce/products/123
```

#### Create Product
```typescript
POST /api/woocommerce/products
Body: {
  "name": "New Product",
  "type": "simple",
  "regular_price": "19.99"
}
```

#### Update Product
```typescript
PUT /api/woocommerce/products/123
Body: {
  "regular_price": "29.99"
}
```

#### Delete Product
```typescript
DELETE /api/woocommerce/products/123?force=true
```

### Inventory

#### Update Stock
```typescript
PUT /api/woocommerce/inventory
Body: {
  "product_id": 123,
  "stock_quantity": 50
}
```

### Orders

#### Get All Orders
```typescript
GET /api/woocommerce/orders
```

#### Get Order by ID
```typescript
GET /api/woocommerce/orders?id=456
// or
GET /api/woocommerce/orders/456
```

#### Create Order
```typescript
POST /api/woocommerce/orders
Body: {
  "payment_method": "cod",
  "billing": {
    "first_name": "John"
  },
  "line_items": [{
    "product_id": 12,
    "quantity": 1
  }]
}
```

#### Update Order
```typescript
PUT /api/woocommerce/orders/456
Body: {
  "status": "completed"
}
```

#### Delete Order
```typescript
DELETE /api/woocommerce/orders/456?force=true
```

### Coupons

#### Get All Coupons
```typescript
GET /api/woocommerce/coupons
```

#### Get Coupon by ID
```typescript
GET /api/woocommerce/coupons?id=789
// or
GET /api/woocommerce/coupons/789
```

#### Create Coupon
```typescript
POST /api/woocommerce/coupons
Body: {
  "code": "DISCOUNT10",
  "discount_type": "percent",
  "amount": "10"
}
```

#### Update Coupon
```typescript
PUT /api/woocommerce/coupons/789
Body: {
  "amount": "15"
}
```

#### Delete Coupon
```typescript
DELETE /api/woocommerce/coupons/789?force=true
```

### Customers

#### Get All Customers
```typescript
GET /api/woocommerce/customers
```

#### Get Customer by ID
```typescript
GET /api/woocommerce/customers?id=101
// or
GET /api/woocommerce/customers/101
```

#### Create Customer
```typescript
POST /api/woocommerce/customers
Body: {
  "email": "test@example.com",
  "first_name": "Test"
}
```

#### Update Customer
```typescript
PUT /api/woocommerce/customers/101
Body: {
  "first_name": "Updated"
}
```

#### Delete Customer
```typescript
DELETE /api/woocommerce/customers/101?force=true
```

### Categories

#### Get All Categories
```typescript
GET /api/woocommerce/categories
```

#### Get Category by ID
```typescript
GET /api/woocommerce/categories?id=5
```

### Payment Gateways

#### Get All Payment Gateways
```typescript
GET /api/woocommerce/payment-gateways
```

#### Get Payment Gateway by ID
```typescript
GET /api/woocommerce/payment-gateways?id=cod
```

### Shipping

#### Get All Shipping Zones
```typescript
GET /api/woocommerce/shipping
```

#### Get Shipping Zone by ID
```typescript
GET /api/woocommerce/shipping?id=1
```

### Taxes

#### Get All Taxes
```typescript
GET /api/woocommerce/taxes
```

#### Get Tax by ID
```typescript
GET /api/woocommerce/taxes?id=1
```

### Cart (Store API)

#### Get Cart
```typescript
GET /api/woocommerce/cart
```

#### Add to Cart
```typescript
POST /api/woocommerce/cart
Body: {
  "product_id": 123,
  "quantity": 1
}
```

## Using React Hooks

The application includes custom React hooks for easy data fetching:

```typescript
import { useProducts, useProduct, useCategories, useCart } from '@/lib/hooks/useWooCommerce';

// Get all products
const { data: products, loading, error } = useProducts();

// Get single product
const { data: product, loading, error } = useProduct(productId);

// Get categories
const { data: categories, loading, error } = useCategories();

// Get cart and add items
const { data: cart, loading, error, addToCart } = useCart();

// Add item to cart
await addToCart(123, 2); // productId, quantity
```

## Direct API Client Usage

You can also use the WooCommerce client directly:

```typescript
import woocommerce from '@/lib/woocommerce';

// Get products
const products = await woocommerce.getProducts({ per_page: 10 });

// Get single product
const product = await woocommerce.getProduct(123);

// Create order
const order = await woocommerce.createOrder({
  payment_method: 'cod',
  billing: { first_name: 'John' },
  line_items: [{ product_id: 12, quantity: 1 }]
});
```

## Error Handling

All API routes return standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

Error responses include an `error` field with a descriptive message:

```json
{
  "error": "Failed to fetch products"
}
```

## Notes

- All API routes handle authentication automatically using environment variables
- The Store API (cart) doesn't require authentication
- For production, ensure your WooCommerce site has HTTPS enabled
- Rate limiting may apply based on your WooCommerce configuration

