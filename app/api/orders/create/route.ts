import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/orders/create
 * Create a new order in WooCommerce
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      shippingAddress,
      paymentMethod,
      cartItems,
      cartTotal,
      shippingCost,
      couponDiscount,
      couponCode,
    } = body;

    // Validate required fields
    if (!shippingAddress || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Shipping address and cart items are required' },
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

    // Get user from auth token if available
    let customerId = null;
    try {
      const cookieStore = await cookies();
      const authToken = cookieStore.get('auth_token');
      if (authToken) {
        const user = JSON.parse(authToken.value);
        customerId = user.id;
      }
    } catch (error) {
      // User not logged in, continue as guest
    }

    // Prepare line items for WooCommerce
    const lineItems = cartItems.map((item: any) => {
      // Extract product ID from item.id
      // Format can be: "123", "123-M", "product-123", etc.
      let productId: number;
      
      if (typeof item.id === 'string') {
        // Remove "product-" prefix if present
        const cleanId = item.id.replace('product-', '');
        // Extract number before first hyphen (for size variants like "123-M")
        const idMatch = cleanId.match(/^(\d+)/);
        productId = idMatch ? parseInt(idMatch[1]) : parseInt(cleanId);
      } else {
        productId = parseInt(item.id);
      }

      // Validate product ID
      if (isNaN(productId) || productId <= 0) {
        throw new Error(`Invalid product ID in cart item: ${item.id}`);
      }

      const lineItem: any = {
        product_id: productId,
        quantity: item.quantity,
      };

      // Add size as meta data if present
      if (item.size) {
        lineItem.meta_data = [{ key: 'Size', value: item.size }];
      }

      return lineItem;
    });

    // Prepare order data for WooCommerce
    const orderData: any = {
      payment_method: paymentMethod || 'cod',
      payment_method_title: paymentMethod === 'cod' 
        ? 'Cash on Delivery' 
        : paymentMethod === 'upi' 
          ? 'UPI Payment'
          : paymentMethod === 'card'
            ? 'Credit/Debit Card'
            : 'Net Banking',
      set_paid: false, // Will be true when payment is confirmed
      billing: {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address_1: shippingAddress.address,
        address_2: shippingAddress.apartment || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.pincode,
        country: 'IN',
      },
      shipping: {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        address_1: shippingAddress.address,
        address_2: shippingAddress.apartment || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.pincode,
        country: 'IN',
      },
      line_items: lineItems,
      shipping_lines: shippingCost > 0 ? [{
        method_id: 'flat_rate',
        method_title: 'Flat Rate',
        total: shippingCost.toString(),
      }] : [],
    };

    // Add customer ID if user is logged in
    if (customerId) {
      orderData.customer_id = customerId;
    }

    // Add coupon if applied
    if (couponCode && couponDiscount > 0) {
      orderData.coupon_lines = [{
        code: couponCode,
        discount: couponDiscount.toString(),
      }];
    }

    // Create order via WooCommerce API
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '');
    const createOrderUrl = `${cleanBaseUrl}/wp-json/wc/v3/orders?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    const response = await fetch(createOrderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('WooCommerce Order Creation Error:', errorData);
      return NextResponse.json(
        { 
          error: errorData.message || errorData.code || 'Failed to create order',
          details: errorData,
        },
        { status: response.status }
      );
    }

    const order = await response.json();

    // Return order data
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.number || order.id,
        status: order.status,
        total: order.total,
        currency: order.currency || 'INR',
        dateCreated: order.date_created,
        paymentMethod: order.payment_method,
        billing: order.billing,
        shipping: order.shipping,
        lineItems: order.line_items,
      },
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}

