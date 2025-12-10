import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/woocommerce/categories
 * Direct WooCommerce API call - no wrapper
 * URL: {{base_url}}/wp-json/wc/v3/products/categories?consumer_key={{ck}}&consumer_secret={{cs}}
 */
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('id');
    
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
    
    // Build URL: {{base_url}}/wp-json/wc/v3/products/categories?consumer_key={{ck}}&consumer_secret={{cs}}
    const endpoint = categoryId ? `products/categories/${categoryId}` : 'products/categories';
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
        { error: errorData.message || errorData.error || `Failed to fetch categories: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

