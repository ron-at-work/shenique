import { NextRequest, NextResponse } from 'next/server';

/**
 * Centralized WooCommerce API Handler
 * Handles all WooCommerce API calls through a single route
 * 
 * Examples:
 * GET /api/woocommerce/products
 * GET /api/woocommerce/products/123
 * GET /api/woocommerce/products?slug=product-slug
 * GET /api/woocommerce/categories
 * POST /api/woocommerce/orders
 * PUT /api/woocommerce/products/123
 * DELETE /api/woocommerce/products/123?force=true
 */

// Get environment variables
function getEnvVars() {
  // Read environment variables at runtime
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const consumerKey = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY;
  const consumerSecret = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET;

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment Variables Check:', {
      baseUrl: baseUrl ? `${baseUrl.substring(0, 20)}...` : 'NOT SET',
      consumerKey: consumerKey ? 'SET' : 'NOT SET',
      consumerSecret: consumerSecret ? 'SET' : 'NOT SET',
    });
  }

  return { baseUrl, consumerKey, consumerSecret };
}

// Validate environment variables
function validateEnvVars(baseUrl: string | undefined, consumerKey: string | undefined, consumerSecret: string | undefined) {
  if (!baseUrl || !consumerKey || !consumerSecret) {
    console.error('Missing environment variables:', {
      baseUrl: baseUrl ? 'SET' : 'MISSING',
      consumerKey: consumerKey ? 'SET' : 'MISSING',
      consumerSecret: consumerSecret ? 'SET' : 'MISSING',
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.includes('API') || key.includes('WORDPRESS')
      )
    });
    
    return NextResponse.json(
      { 
        error: 'Missing environment variables. Please set NEXT_PUBLIC_API_BASE_URL (or API_BASE_URL), NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY (or WORDPRESS_CONSUMER_KEY), and NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET (or WORDPRESS_CONSUMER_SECRET) in your .env.local file',
        details: 'Make sure to restart your Next.js server after creating/updating .env.local'
      },
      { status: 500 }
    );
  }
  return null;
}

// Build WooCommerce API URL
function buildWooCommerceUrl(
  baseUrl: string,
  endpoint: string,
  consumerKey: string,
  consumerSecret: string,
  queryParams: URLSearchParams
): string {
  const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
  
  // Validate URL format
  if (!cleanBaseUrl.startsWith('http://') && !cleanBaseUrl.startsWith('https://')) {
    throw new Error(`NEXT_PUBLIC_API_BASE_URL must start with http:// or https://. Current value: ${cleanBaseUrl}`);
  }

  // Build query params with authentication
  const finalParams = new URLSearchParams(queryParams);
  finalParams.append('consumer_key', consumerKey);
  finalParams.append('consumer_secret', consumerSecret);

  // Determine API version (wc/v3 for most endpoints, wc/store/v1 for cart)
  let apiVersion = 'wc/v3';
  if (endpoint === 'cart' || endpoint.startsWith('cart/') || endpoint.includes('store')) {
    apiVersion = 'wc/store/v1';
    // For Store API, remove consumer_key and consumer_secret (not needed)
    finalParams.delete('consumer_key');
    finalParams.delete('consumer_secret');
  }

  const url = `${cleanBaseUrl}/wp-json/${apiVersion}/${endpoint}?${finalParams.toString()}`;
  
  if (process.env.NODE_ENV === 'development') {
    const safeUrl = url.replace(/consumer_secret=[^&]*/, 'consumer_secret=***');
    console.log('🔗 WooCommerce API Call:', safeUrl);
    console.log('📍 Base URL Used:', cleanBaseUrl);
  }
  
  return url;
}

// Handle GET requests
async function handleGET(request: NextRequest, pathSegments: string[]) {
  const { baseUrl, consumerKey, consumerSecret } = getEnvVars();
  const validationError = validateEnvVars(baseUrl, consumerKey, consumerSecret);
  if (validationError) return validationError;

  const searchParams = request.nextUrl.searchParams;
  const path = pathSegments.join('/');

  // Build query params (excluding special params that are part of the path)
  const queryParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    // Skip 'id' and 'slug' if they're in the path, otherwise include them
    if (key !== 'id' || !pathSegments.includes(value)) {
      queryParams.append(key, value);
    }
  });

  // Handle slug parameter for products
  if (path === 'products' && searchParams.has('slug')) {
    queryParams.append('slug', searchParams.get('slug')!);
  }

  try {
    const url = buildWooCommerceUrl(baseUrl!, path, consumerKey!, consumerSecret!, queryParams);
    
    // Log the actual WooCommerce URL being called (server-side only)
    console.log('🚀 Server-side: Calling WooCommerce API at:', url.replace(/consumer_secret=[^&]*/, 'consumer_secret=***'));
    
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
        error: errorData,
        endpoint: path
      });
      
      return NextResponse.json(
        { 
          error: errorData.message || errorData.error || `Failed to fetch ${path}: ${response.statusText}` 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`WooCommerce API Error (${path}):`, error);
    return NextResponse.json(
      { 
        error: error.message || `Failed to fetch ${path}`,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Handle POST requests
async function handlePOST(request: NextRequest, pathSegments: string[]) {
  const { baseUrl, consumerKey, consumerSecret } = getEnvVars();
  const validationError = validateEnvVars(baseUrl, consumerKey, consumerSecret);
  if (validationError) return validationError;

  const path = pathSegments.join('/');
  const searchParams = request.nextUrl.searchParams;
  let body = await request.json().catch(() => ({}));

  // Special handling for cart/add-item endpoint
  if (path === 'cart/add-item' && body.product_id) {
    body = {
      id: body.product_id,
      quantity: body.quantity || 1
    };
  }

  // Build query params
  const queryParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    queryParams.append(key, value);
  });

  try {
    const url = buildWooCommerceUrl(baseUrl!, path, consumerKey!, consumerSecret!, queryParams);
    
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
        { error: errorData.message || `Failed to create ${path}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error(`WooCommerce API Error (POST ${path}):`, error);
    return NextResponse.json(
      { error: error.message || `Failed to create ${path}` },
      { status: 500 }
    );
  }
}

// Handle PUT requests
async function handlePUT(request: NextRequest, pathSegments: string[]) {
  const { baseUrl, consumerKey, consumerSecret } = getEnvVars();
  const validationError = validateEnvVars(baseUrl, consumerKey, consumerSecret);
  if (validationError) return validationError;

  const path = pathSegments.join('/');
  const searchParams = request.nextUrl.searchParams;
  const body = await request.json().catch(() => ({}));

  // Build query params
  const queryParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    queryParams.append(key, value);
  });

  try {
    const url = buildWooCommerceUrl(baseUrl!, path, consumerKey!, consumerSecret!, queryParams);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || `Failed to update ${path}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`WooCommerce API Error (PUT ${path}):`, error);
    return NextResponse.json(
      { error: error.message || `Failed to update ${path}` },
      { status: 500 }
    );
  }
}

// Handle DELETE requests
async function handleDELETE(request: NextRequest, pathSegments: string[]) {
  const { baseUrl, consumerKey, consumerSecret } = getEnvVars();
  const validationError = validateEnvVars(baseUrl, consumerKey, consumerSecret);
  if (validationError) return validationError;

  const path = pathSegments.join('/');
  const searchParams = request.nextUrl.searchParams;
  const force = searchParams.get('force') === 'true';

  // Build query params
  const queryParams = new URLSearchParams();
  if (force) {
    queryParams.append('force', 'true');
  }
  searchParams.forEach((value, key) => {
    if (key !== 'force') {
      queryParams.append(key, value);
    }
  });

  try {
    const url = buildWooCommerceUrl(baseUrl!, path, consumerKey!, consumerSecret!, queryParams);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || `Failed to delete ${path}` },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({ success: true }));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`WooCommerce API Error (DELETE ${path}):`, error);
    return NextResponse.json(
      { error: error.message || `Failed to delete ${path}` },
      { status: 500 }
    );
  }
}

// Main route handler - handles all HTTP methods
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleGET(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handlePOST(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handlePUT(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleDELETE(request, path);
}

