# WooCommerce API Integration Guide

This document explains how to use the WooCommerce REST API integration in this Next.js application.

## Setup

1. Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://shenique.in
NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY=your_consumer_key_here
NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET=your_consumer_secret_here
```

2. Get your WooCommerce API credentials from:
   - WordPress Admin → WooCommerce → Settings → Advanced → REST API
   - Create a new API key with Read/Write permissions

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

