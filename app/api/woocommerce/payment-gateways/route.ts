import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/payment-gateways
 * Get all payment gateways or a single gateway by ID
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gatewayId = searchParams.get('id');
    
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'id') {
        params[key] = value;
      }
    });

    if (gatewayId) {
      const gateway = await woocommerce.getPaymentGateway(gatewayId, params);
      return NextResponse.json(gateway);
    }

    const gateways = await woocommerce.getPaymentGateways(params);
    return NextResponse.json(gateways);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payment gateways' },
      { status: 500 }
    );
  }
}

