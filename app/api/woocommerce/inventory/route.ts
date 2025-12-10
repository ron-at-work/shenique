import { NextRequest, NextResponse } from 'next/server';

/**
 * PUT /api/woocommerce/inventory
 * Update Stock
 * Body: { product_id: number, stock_quantity: number }
 * URL: {{base_url}}/wp-json/wc/v3/products/{{product_id}}?consumer_key={{ck}}&consumer_secret={{cs}}
 */
export async function PUT(request: NextRequest) {
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
    const { product_id, stock_quantity } = body;

    if (!product_id || stock_quantity === undefined) {
      return NextResponse.json(
        { error: 'product_id and stock_quantity are required' },
        { status: 400 }
      );
    }

    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const url = `${cleanBaseUrl}/wp-json/wc/v3/products/${product_id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to update stock' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update stock' },
      { status: 500 }
    );
  }
}

