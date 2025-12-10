import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/woocommerce/products
 * Direct WooCommerce API call - no wrapper
 * URL: {{base_url}}/wp-json/wc/v3/products?consumer_key={{ck}}&consumer_secret={{cs}}
 */
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET;

    if (!baseUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json(
        { error: 'Missing environment variables. Please set NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY, and NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('id');
    
    // Build query params
    const queryParams = new URLSearchParams();
    queryParams.append('consumer_key', consumerKey);
    queryParams.append('consumer_secret', consumerSecret);
    
    // Add other query params
    searchParams.forEach((value, key) => {
      if (key !== 'id') {
        queryParams.append(key, value);
      }
    });

    // Clean base URL
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    
    // Build URL: {{base_url}}/wp-json/wc/v3/products?consumer_key={{ck}}&consumer_secret={{cs}}
    const endpoint = productId ? `products/${productId}` : 'products';
    const url = `${cleanBaseUrl}/wp-json/wc/v3/${endpoint}?${queryParams.toString()}`;

    console.log('Calling WooCommerce API:', url.replace(/consumer_secret=[^&]*/, 'consumer_secret=***'));

    // Direct fetch to WooCommerce API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error('WooCommerce API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { error: errorData.message || errorData.error || `Failed to fetch products: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch products',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/woocommerce/products
 * Direct WooCommerce API call - Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET;

    if (!baseUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json(
        { error: 'Missing environment variables' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const url = `${cleanBaseUrl}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to create product' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

