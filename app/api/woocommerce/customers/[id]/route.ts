import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/customers/[id]
 * Get customer by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await woocommerce.getCustomer(params.id);
    return NextResponse.json(customer);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/woocommerce/customers/[id]
 * Update customer
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const customer = await woocommerce.updateCustomer(params.id, body);
    return NextResponse.json(customer);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update customer' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/woocommerce/customers/[id]
 * Delete customer
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const force = searchParams.get('force') === 'true';
    
    await woocommerce.deleteCustomer(params.id, force);
    return NextResponse.json({ success: true, message: 'Customer deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
}

