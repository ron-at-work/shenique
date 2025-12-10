import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/woocommerce/products/[id]
 * Get Product by ID
 * URL: {{base_url}}/wp-json/wc/v3/products/{{product_id}}?consumer_key={{ck}}&consumer_secret={{cs}}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const url = `${cleanBaseUrl}/wp-json/wc/v3/products/${params.id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch product' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/woocommerce/products/[id]
 * Update Product
 * URL: {{base_url}}/wp-json/wc/v3/products/{{product_id}}?consumer_key={{ck}}&consumer_secret={{cs}}
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const url = `${cleanBaseUrl}/wp-json/wc/v3/products/${params.id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to update product' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/woocommerce/products/[id]
 * Delete Product
 * URL: {{base_url}}/wp-json/wc/v3/products/{{product_id}}?force=true&consumer_key={{ck}}&consumer_secret={{cs}}
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const force = searchParams.get('force') === 'true';
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const url = `${cleanBaseUrl}/wp-json/wc/v3/products/${params.id}?force=${force}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete product' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

