"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/context/AuthContext";

interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  payment_method: string;
  payment_method_title: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    price: string;
    image?: {
      src: string;
    };
  }>;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    // Check if user is logged in
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch orders
    fetchOrders();
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders for the logged-in customer
      const response = await fetch(`/api/woocommerce/orders?customer=${user?.id}&per_page=20&orderby=date&order=desc`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-8">Please login to view your orders</p>
            <Link
              href="/auth/login?redirect=/orders"
              className="inline-block px-8 py-3 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors"
            >
              Login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track all your orders</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B1E3A] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
                <p className="text-gray-600 mb-8">You haven't placed any orders yet</p>
                <Link
                  href="/kurti"
                  className="inline-block px-8 py-3 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order.number || order.id}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Placed on {formatDate(order.date_created)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{parseFloat(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            {order.payment_method_title || order.payment_method}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.line_items.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            {item.image?.src && (
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={item.image.src}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ₹{parseFloat(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-medium text-gray-900">
                                ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-900 mb-1">Delivery Address</p>
                          <p>
                            {order.shipping.first_name} {order.shipping.last_name}
                          </p>
                          <p>
                            {order.shipping.address_1}
                            {order.shipping.address_2 && `, ${order.shipping.address_2}`}
                          </p>
                          <p>
                            {order.shipping.city}, {order.shipping.state} - {order.shipping.postcode}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          
                          {order.status === 'processing' && (
                            <button className="px-4 py-2 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors">
                              Track Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

