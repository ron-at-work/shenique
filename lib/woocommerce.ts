/**
 * WooCommerce REST API Client
 * Complete integration for WooCommerce API endpoints
 * 
 * Uses environment variables:
 * - NEXT_PUBLIC_API_BASE_URL: Base URL for WooCommerce API
 * - NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY: Consumer Key for authentication
 * - NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET: Consumer Secret for authentication
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET || '';

// Validate environment variables
if (!BASE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
  const missing = [];
  if (!BASE_URL) missing.push('NEXT_PUBLIC_API_BASE_URL');
  if (!CONSUMER_KEY) missing.push('NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY');
  if (!CONSUMER_SECRET) missing.push('NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET');
  
  console.error('WooCommerce API: Missing required environment variables:', missing.join(', '));
  console.error('Please set these in your .env.local file');
}

interface WooCommerceParams {
  consumer_key?: string;
  consumer_secret?: string;
  [key: string]: any;
}

class WooCommerceAPI {
  private baseUrl: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    this.baseUrl = BASE_URL;
    this.consumerKey = CONSUMER_KEY;
    this.consumerSecret = CONSUMER_SECRET;
  }

  private buildUrl(endpoint: string, params: WooCommerceParams = {}): string {
    // Read environment variables at runtime (for server-side API routes)
    // यह सुनिश्चित करता है कि सभी API calls में consumer_key और consumer_secret शामिल हों
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
    const consumerKey = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY || this.consumerKey;
    const consumerSecret = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET || this.consumerSecret;

    // Validate base URL is set
    if (!baseUrl || baseUrl.trim() === '') {
      const errorMsg = 'NEXT_PUBLIC_API_BASE_URL is not set or is empty. Please add it to your .env.local file. Current value: ' + (baseUrl || 'undefined');
      console.error('WooCommerce API Error:', errorMsg);
      throw new Error(errorMsg);
    }

    // Ensure base URL doesn't end with a slash
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    
    // Validate it's a proper URL (starts with http:// or https://)
    if (!cleanBaseUrl.startsWith('http://') && !cleanBaseUrl.startsWith('https://')) {
      const errorMsg = `NEXT_PUBLIC_API_BASE_URL must start with http:// or https://. Current value: ${cleanBaseUrl}`;
      console.error('WooCommerce API Error:', errorMsg);
      throw new Error(errorMsg);
    }
    
    // Construct the full URL
    const url = new URL(`${cleanBaseUrl}/wp-json/wc/v3/${endpoint}`);
    
    // Always add authentication from environment variables as query params
    // सभी API calls में consumer_key और consumer_secret automatically add होते हैं
    if (!consumerKey || !consumerSecret) {
      const errorMsg = 'WooCommerce credentials are missing. Please set NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY and NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET in your .env.local file';
      console.error('WooCommerce API Error:', errorMsg);
      throw new Error(errorMsg);
    }
    
    // हर API call में consumer_key और consumer_secret जरूरी हैं
    url.searchParams.append('consumer_key', consumerKey);
    url.searchParams.append('consumer_secret', consumerSecret);
    
    // Add other params (excluding consumer_key and consumer_secret to avoid duplicates)
    Object.keys(params).forEach(key => {
      if (key !== 'consumer_key' && key !== 'consumer_secret') {
        url.searchParams.append(key, params[key]);
      }
    });
    
    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    params: WooCommerceParams = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    
    // Log the URL in development for debugging (without exposing secrets)
    if (process.env.NODE_ENV === 'development') {
      const safeUrl = url.replace(/consumer_secret=[^&]*/, 'consumer_secret=***');
      console.log('WooCommerce API Request:', safeUrl);
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Unknown error' };
      }
      
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      console.error('WooCommerce API Error:', {
        status: response.status,
        statusText: response.statusText,
        message: errorMessage,
        url: url.replace(/consumer_secret=[^&]*/, 'consumer_secret=***')
      });
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // ==================== PRODUCTS ====================
  // Note: सभी methods में consumer_key और consumer_secret automatically add होते हैं
  // buildUrl() method हर request में environment variables से ये credentials add करता है
  
  /**
   * Get all products
   * Automatically includes consumer_key and consumer_secret from env
   */
  async getProducts(params: WooCommerceParams = {}): Promise<any> {
    return this.request('products', { method: 'GET' }, params);
  }

  /**
   * Get product by ID
   */
  async getProduct(productId: number | string, params: WooCommerceParams = {}): Promise<any> {
    return this.request(`products/${productId}`, { method: 'GET' }, params);
  }

  /**
   * Create a new product
   */
  async createProduct(productData: any, params: WooCommerceParams = {}): Promise<any> {
    return this.request('products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }, params);
  }

  /**
   * Update a product
   */
  async updateProduct(
    productId: number | string,
    productData: any,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.request(`products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }, params);
  }

  /**
   * Delete a product
   */
  async deleteProduct(
    productId: number | string,
    force: boolean = true,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.request(
      `products/${productId}`,
      { method: 'DELETE' },
      { ...params, force: force.toString() }
    );
  }

  // ==================== INVENTORY ====================
  
  /**
   * Update product stock
   */
  async updateStock(
    productId: number | string,
    stockQuantity: number,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.updateProduct(productId, { stock_quantity: stockQuantity }, params);
  }

  // ==================== ORDERS ====================
  
  /**
   * Get all orders
   */
  async getOrders(params: WooCommerceParams = {}): Promise<any> {
    return this.request('orders', { method: 'GET' }, params);
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: number | string, params: WooCommerceParams = {}): Promise<any> {
    return this.request(`orders/${orderId}`, { method: 'GET' }, params);
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: any, params: WooCommerceParams = {}): Promise<any> {
    return this.request('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }, params);
  }

  /**
   * Update an order
   */
  async updateOrder(
    orderId: number | string,
    orderData: any,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.request(`orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    }, params);
  }

  /**
   * Delete an order
   */
  async deleteOrder(
    orderId: number | string,
    force: boolean = true,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.request(
      `orders/${orderId}`,
      { method: 'DELETE' },
      { ...params, force: force.toString() }
    );
  }

  // ==================== COUPONS ====================
  
  /**
   * Get all coupons
   */
  async getCoupons(params: WooCommerceParams = {}): Promise<any> {
    return this.request('coupons', { method: 'GET' }, params);
  }

  /**
   * Get coupon by ID
   */
  async getCoupon(couponId: number | string, params: WooCommerceParams = {}): Promise<any> {
    return this.request(`coupons/${couponId}`, { method: 'GET' }, params);
  }

  /**
   * Create a new coupon
   */
  async createCoupon(couponData: any, params: WooCommerceParams = {}): Promise<any> {
    return this.request('coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    }, params);
  }

  /**
   * Update a coupon
   */
  async updateCoupon(
    couponId: number | string,
    couponData: any,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.request(`coupons/${couponId}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
    }, params);
  }

  /**
   * Delete a coupon
   */
  async deleteCoupon(
    couponId: number | string,
    force: boolean = true,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.request(
      `coupons/${couponId}`,
      { method: 'DELETE' },
      { ...params, force: force.toString() }
    );
  }

  // ==================== CUSTOMERS ====================
  
  /**
   * Get all customers
   */
  async getCustomers(params: WooCommerceParams = {}): Promise<any> {
    return this.request('customers', { method: 'GET' }, params);
  }

  /**
   * Get customer by ID
   */
  async getCustomer(customerId: number | string, params: WooCommerceParams = {}): Promise<any> {
    return this.request(`customers/${customerId}`, { method: 'GET' }, params);
  }

  /**
   * Create a new customer
   */
  async createCustomer(customerData: any, params: WooCommerceParams = {}): Promise<any> {
    return this.request('customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    }, params);
  }

  /**
   * Update a customer
   */
  async updateCustomer(
    customerId: number | string,
    customerData: any,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.request(`customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    }, params);
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(
    customerId: number | string,
    force: boolean = true,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.request(
      `customers/${customerId}`,
      { method: 'DELETE' },
      { ...params, force: force.toString() }
    );
  }

  // ==================== CATEGORIES ====================
  
  /**
   * Get all product categories
   */
  async getCategories(params: WooCommerceParams = {}): Promise<any> {
    return this.request('products/categories', { method: 'GET' }, params);
  }

  /**
   * Get category by ID
   */
  async getCategory(categoryId: number | string, params: WooCommerceParams = {}): Promise<any> {
    return this.request(`products/categories/${categoryId}`, { method: 'GET' }, params);
  }

  // ==================== PAYMENT GATEWAYS ====================
  
  /**
   * Get all payment gateways
   */
  async getPaymentGateways(params: WooCommerceParams = {}): Promise<any> {
    return this.request('payment_gateways', { method: 'GET' }, params);
  }

  /**
   * Get payment gateway by ID
   */
  async getPaymentGateway(
    gatewayId: string,
    params: WooCommerceParams = {}
  ): Promise<any> {
    return this.request(`payment_gateways/${gatewayId}`, { method: 'GET' }, params);
  }

  // ==================== SHIPPING ====================
  
  /**
   * Get all shipping zones
   */
  async getShippingZones(params: WooCommerceParams = {}): Promise<any> {
    return this.request('shipping/zones', { method: 'GET' }, params);
  }

  /**
   * Get shipping zone by ID
   */
  async getShippingZone(zoneId: number | string, params: WooCommerceParams = {}): Promise<any> {
    return this.request(`shipping/zones/${zoneId}`, { method: 'GET' }, params);
  }

  // ==================== TAXES ====================
  
  /**
   * Get all taxes
   */
  async getTaxes(params: WooCommerceParams = {}): Promise<any> {
    return this.request('taxes', { method: 'GET' }, params);
  }

  /**
   * Get tax by ID
   */
  async getTax(taxId: number | string, params: WooCommerceParams = {}): Promise<any> {
    return this.request(`taxes/${taxId}`, { method: 'GET' }, params);
  }

  // ==================== CART (Store API) ====================
  
  /**
   * Get cart (using WooCommerce Store API)
   */
  async getCart(): Promise<any> {
    // Read environment variable at runtime
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
    
    if (!baseUrl || baseUrl.trim() === '') {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not set. Please add it to your .env.local file');
    }

    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const url = `${cleanBaseUrl}/wp-json/wc/store/v1/cart`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Add item to cart (using WooCommerce Store API)
   */
  async addToCart(productId: number, quantity: number = 1): Promise<any> {
    // Read environment variable at runtime
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
    
    if (!baseUrl || baseUrl.trim() === '') {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not set. Please add it to your .env.local file');
    }

    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const url = `${cleanBaseUrl}/wp-json/wc/store/v1/cart/add-item`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: productId,
        quantity: quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const woocommerce = new WooCommerceAPI();
export default woocommerce;

