import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/orders
 * Get all orders or a single order by ID
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('id');
    
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'id') {
        params[key] = value;
      }
    });

    if (orderId) {
      const order = await woocommerce.getOrder(orderId, params);
      return NextResponse.json(order);
    }

    const orders = await woocommerce.getOrders(params);
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/woocommerce/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await woocommerce.createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

