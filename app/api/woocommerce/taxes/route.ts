import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/taxes
 * Get all taxes or a single tax by ID
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taxId = searchParams.get('id');
    
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'id') {
        params[key] = value;
      }
    });

    if (taxId) {
      const tax = await woocommerce.getTax(taxId, params);
      return NextResponse.json(tax);
    }

    const taxes = await woocommerce.getTaxes(params);
    return NextResponse.json(taxes);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch taxes' },
      { status: 500 }
    );
  }
}

