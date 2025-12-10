import { NextRequest, NextResponse } from 'next/server';
import woocommerce from '@/lib/woocommerce';

/**
 * GET /api/woocommerce/shipping
 * Get all shipping zones or a single zone by ID
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const zoneId = searchParams.get('id');
    
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'id') {
        params[key] = value;
      }
    });

    if (zoneId) {
      const zone = await woocommerce.getShippingZone(zoneId, params);
      return NextResponse.json(zone);
    }

    const zones = await woocommerce.getShippingZones(params);
    return NextResponse.json(zones);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipping zones' },
      { status: 500 }
    );
  }
}

