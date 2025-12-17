import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/orders/[id]
 * Get order by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await woocommerce.getOrder(id);
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/woocommerce/orders/[id]
 * Update order
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const order = await woocommerce.updateOrder(id, body);
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/woocommerce/orders/[id]
 * Delete order
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const force = searchParams.get('force') === 'true';
    
    await woocommerce.deleteOrder(id, force);
    return NextResponse.json({ success: true, message: 'Order deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}
