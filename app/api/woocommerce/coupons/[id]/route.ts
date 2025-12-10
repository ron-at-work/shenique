import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/coupons/[id]
 * Get coupon by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const coupon = await woocommerce.getCoupon(params.id);
    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/woocommerce/coupons/[id]
 * Update coupon
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const coupon = await woocommerce.updateCoupon(params.id, body);
    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/woocommerce/coupons/[id]
 * Delete coupon
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const force = searchParams.get('force') === 'true';
    
    await woocommerce.deleteCoupon(params.id, force);
    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}

