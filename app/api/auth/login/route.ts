import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/login
 * Login using JWT Authentication plugin
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get environment variables
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Authenticate using JWT Authentication plugin
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const jwtUrl = `${cleanBaseUrl}/wp-json/jwt-auth/v1/token`;
    
    const jwtResponse = await fetch(jwtUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    if (!jwtResponse.ok) {
      const errorData = await jwtResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Invalid email or password' },
        { status: 401 }
      );
    }

    const jwtData = await jwtResponse.json();
    const token = jwtData.token;
    const userData = jwtData.user || {};

    // Get customer details from WooCommerce
    const consumerKey = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET;

    let customer = null;
    if (consumerKey && consumerSecret) {
      try {
        const searchUrl = `${cleanBaseUrl}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
        const searchResponse = await fetch(searchUrl);
        
        if (searchResponse.ok) {
          const customers = await searchResponse.json();
          if (customers && customers.length > 0) {
            customer = customers[0];
          }
        }
      } catch (error) {
        console.error('Failed to fetch customer details:', error);
      }
    }

    // Set auth token cookie with JWT token and user data
    const cookieStore = await cookies();
    cookieStore.set('auth_token', JSON.stringify({
      token: token,
      id: customer?.id || userData.id || userData.ID,
      email: customer?.email || userData.email || email,
      name: customer ? `${customer.first_name} ${customer.last_name}`.trim() : userData.display_name || userData.name || email,
      loginTime: Date.now(),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: customer?.id || userData.id || userData.ID,
        email: customer?.email || userData.email || email,
        firstName: customer?.first_name || userData.first_name || '',
        lastName: customer?.last_name || userData.last_name || '',
        displayName: customer ? `${customer.first_name} ${customer.last_name}`.trim() : userData.display_name || userData.name || email,
        avatar: customer?.avatar_url || userData.avatar_url,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

