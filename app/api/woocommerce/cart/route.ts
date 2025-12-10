import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/cart
 * Get cart (using WooCommerce Store API)
 */
export async function GET(request: NextRequest) {
  try {
    const cart = await woocommerce.getCart();
    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/woocommerce/cart
 * Add item to cart
 * Body: { product_id: number, quantity: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, quantity = 1 } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      );
    }

    const cart = await woocommerce.addToCart(product_id, quantity);
    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

