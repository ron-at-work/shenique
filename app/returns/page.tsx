export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7B1E3A] to-[#5C1629] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Return Policy</h1>
          <p className="text-gray-200">Easy returns within 7 days</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Return Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#F5F0E6] rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">7 Days Return</h3>
              <p className="text-gray-600 text-sm">Easy return window</p>
            </div>
            <div className="bg-[#F5F0E6] rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Exchange</h3>
              <p className="text-gray-600 text-sm">Hassle-free process</p>
            </div>
            <div className="bg-[#F5F0E6] rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Refunds</h3>
              <p className="text-gray-600 text-sm">5-7 business days</p>
            </div>
          </div>

          <div className="prose prose-lg">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Return Eligibility</h2>
              <p className="text-gray-700 mb-4">
                We accept returns within <strong>7 days</strong> from the delivery date. To be eligible for a return:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>The product must be unused, unwashed, and in original condition</li>
                <li>All tags and labels must be intact</li>
                <li>The product must be in its original packaging</li>
                <li>Return request must be initiated within 7 days of delivery</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Non-Returnable Items</h2>
              <p className="text-gray-700 mb-4">
                The following items cannot be returned or exchanged:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Products purchased during sale or with special discounts (above 50% off)</li>
                <li>Customized or personalized products</li>
                <li>Products with removed tags or damaged packaging</li>
                <li>Products that have been washed, altered, or used</li>
                <li>Intimate wear and accessories</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">How to Initiate a Return</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 text-white font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contact Us</h4>
                    <p className="text-gray-600 text-sm">Call us at +91 8799718988 or email hi@shenique.in with your order details</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 text-white font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Approval</h4>
                    <p className="text-gray-600 text-sm">Our team will verify and approve your return request within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 text-white font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pack the Product</h4>
                    <p className="text-gray-600 text-sm">Pack the product securely in its original packaging with all tags intact</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#C9A14A] rounded-full flex items-center justify-center shrink-0 text-white font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Schedule Pickup</h4>
                    <p className="text-gray-600 text-sm">Our courier partner will pick up the package from your address</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Refund Process</h2>
              <p className="text-gray-700 mb-4">
                Once we receive and inspect the returned product:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Quality check is completed within 2-3 business days</li>
                <li>Refund is initiated after approval</li>
                <li>Amount is credited to your original payment method within 5-7 business days</li>
                <li>For COD orders, refund is processed via bank transfer (NEFT/IMPS)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Exchange Process</h2>
              <p className="text-gray-700 mb-4">
                Want to exchange for a different size or color?
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Exchange is subject to product availability</li>
                <li>Contact us within 7 days of delivery with your exchange request</li>
                <li>If the requested product is available, we'll arrange for pickup and delivery</li>
                <li>Any price difference will be adjusted accordingly</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Damaged or Defective Products</h2>
              <p className="text-gray-700 mb-4">
                Received a damaged or defective product?
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Contact us immediately within 48 hours of delivery</li>
                <li>Share photos/videos of the damage with us</li>
                <li>We'll arrange for a free pickup and replacement/refund</li>
                <li>No return shipping charges for defective products</li>
              </ul>
            </section>

            <section className="bg-[#F5F0E6] p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-[#7B1E3A] mb-4">Need Help with Returns?</h2>
              <p className="text-gray-700 mb-4">
                Our customer support team is here to help:
              </p>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> hi@shenique.in</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> +91 8799718988 / +91 9315729367</p>
              <p className="text-gray-700"><strong>Hours:</strong> Monday to Saturday, 10 AM to 6 PM</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

