import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/coupons
 * Get all coupons or a single coupon by ID
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const couponId = searchParams.get('id');
    
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'id') {
        params[key] = value;
      }
    });

    if (couponId) {
      const coupon = await woocommerce.getCoupon(couponId, params);
      return NextResponse.json(coupon);
    }

    const coupons = await woocommerce.getCoupons(params);
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/woocommerce/coupons
 * Create a new coupon
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const coupon = await woocommerce.createCoupon(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

