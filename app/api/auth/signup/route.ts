import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/signup
 * Create a new customer using WooCommerce Customer API
 * Then log them in using JWT authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, username } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get environment variables
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WORDPRESS_CONSUMER_SECRET;

    if (!baseUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Prepare customer data for WooCommerce
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const customerData: any = {
      email: email,
      password: password,
      first_name: firstName || '',
      last_name: lastName || '',
    };

    // Add username if provided, otherwise use email
    if (username) {
      customerData.username = username;
    }

    // Add phone if provided
    if (phone) {
      customerData.billing = {
        phone: phone,
      };
    }

    // Create customer via WooCommerce API
    const createUrl = `${cleanBaseUrl}/wp-json/wc/v3/customers?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
    
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      const errorMessage = errorData?.message || errorData?.code || 'Failed to create account';
      
      // Handle specific WooCommerce errors
      if (errorData?.code === 'registration-error-email-exists') {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: createResponse.status }
      );
    }

    const customer = await createResponse.json();

    // After successful customer creation, log them in using JWT Authentication API
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
      const jwtError = await jwtResponse.json().catch(() => ({}));
      console.error('JWT login failed after signup:', jwtError);
      
      // Customer created but JWT login failed
      // Return error so user knows they need to login manually
      return NextResponse.json(
        { 
          error: jwtError.message || 'Account created but login failed. Please try logging in.',
          requiresLogin: true,
        },
        { status: 400 }
      );
    }

    const jwtData = await jwtResponse.json();
    
    if (!jwtData.token) {
      console.error('JWT token not received:', jwtData);
      return NextResponse.json(
        { error: 'Account created but authentication failed. Please try logging in.' },
        { status: 400 }
      );
    }

    const token = jwtData.token;
    const jwtUser = jwtData.user || {};

    // Set auth token cookie with JWT token and user data
    const cookieStore = await cookies();
    cookieStore.set('auth_token', JSON.stringify({
      token: token,
      id: customer.id || jwtUser.id || jwtUser.ID,
      email: customer.email || jwtUser.email || email,
      name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || jwtUser.display_name || jwtUser.name || email,
      loginTime: Date.now(),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Return user data from JWT response and customer data
    return NextResponse.json({
      success: true,
      user: {
        id: customer.id || jwtUser.id || jwtUser.ID,
        email: customer.email || jwtUser.email || email,
        firstName: customer.first_name || jwtUser.first_name || '',
        lastName: customer.last_name || jwtUser.last_name || '',
        displayName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || jwtUser.display_name || jwtUser.name || email,
        avatar: customer.avatar_url || jwtUser.avatar_url,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Signup failed. Please try again.' },
      { status: 500 }
    );
  }
}

