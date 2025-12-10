import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/customers
 * Get all customers or a single customer by ID
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('id');
    
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'id') {
        params[key] = value;
      }
    });

    if (customerId) {
      const customer = await woocommerce.getCustomer(customerId, params);
      return NextResponse.json(customer);
    }

    const customers = await woocommerce.getCustomers(params);
    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/woocommerce/customers
 * Create a new customer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customer = await woocommerce.createCustomer(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create customer' },
      { status: 500 }
    );
  }
}

