"use client";

import { useState } from "react";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrderData(null);

    if (!orderId.trim()) {
      setError("Please enter your order ID");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call - In production, this would call your actual order tracking API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, show a sample order
      // In production, you would fetch actual order data
      setError("Order not found. Please check your order ID and email address, or contact our support team for assistance.");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7B1E3A] to-[#5C1629] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Track Your Order</h1>
          <p className="text-gray-200">Enter your order details to check the delivery status</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          {/* Track Order Form */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID / Order Number
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., SHQ12345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E3A] focus:border-transparent"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#7B1E3A] text-white rounded-lg font-medium hover:bg-[#5C1629] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Tracking...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Track Order
                  </>
                )}
              </button>
            </form>

            {/* Order Status Display */}
            {orderData && (
              <div className="mt-8 p-6 bg-[#F5F0E6] rounded-xl">
                {/* Order status would be displayed here */}
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F5F0E6] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <a href="mailto:hi@shenique.in" className="text-[#7B1E3A] hover:underline">
                  hi@shenique.in
                </a>
              </div>
              <div className="bg-[#F5F0E6] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <a href="tel:+918799718988" className="text-[#7B1E3A] hover:underline">
                  +91 8799718988
                </a>
              </div>
            </div>
          </div>

          {/* Order Tracking Tips */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Where to Find Your Order ID?</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#C9A14A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Check your order confirmation email</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#C9A14A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Look for the SMS sent after placing your order</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#C9A14A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <Link href="/orders" className="text-[#7B1E3A] hover:underline">Log in to your account</Link> to view all orders
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

