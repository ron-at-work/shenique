export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7B1E3A] to-[#5C1629] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Shipping Policy</h1>
          <p className="text-gray-200">Free shipping on orders above ₹999</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Shipping Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#F5F0E6] rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">On orders above ₹999</p>
            </div>
            <div className="bg-[#F5F0E6] rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">5-7 business days</p>
            </div>
            <div className="bg-[#F5F0E6] rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-[#7B1E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pan-India</h3>
              <p className="text-gray-600 text-sm">We deliver everywhere</p>
            </div>
          </div>

          <div className="prose prose-lg">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Shipping Charges</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#7B1E3A] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Order Value</th>
                      <th className="px-6 py-4 text-left">Shipping Charge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-gray-700">Below ₹499</td>
                      <td className="px-6 py-4 text-gray-700">₹79</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">₹499 - ₹999</td>
                      <td className="px-6 py-4 text-gray-700">₹49</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-700">Above ₹999</td>
                      <td className="px-6 py-4 text-[#7B1E3A] font-semibold">FREE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Delivery Timelines</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#7B1E3A] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Location</th>
                      <th className="px-6 py-4 text-left">Estimated Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-gray-700">Metro Cities (Delhi, Mumbai, Bangalore, etc.)</td>
                      <td className="px-6 py-4 text-gray-700">3-5 business days</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">Tier 2 Cities</td>
                      <td className="px-6 py-4 text-gray-700">5-7 business days</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-700">Other Areas</td>
                      <td className="px-6 py-4 text-gray-700">7-10 business days</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">Remote Areas / Northeast</td>
                      <td className="px-6 py-4 text-gray-700">10-14 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                * Business days exclude Sundays and public holidays. Delivery times may vary during sale periods and festivals.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Order Processing</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Orders are processed within 24-48 hours after payment confirmation</li>
                <li>You will receive a tracking number via SMS and email once your order is shipped</li>
                <li>Orders placed after 2 PM will be processed the next business day</li>
                <li>Cash on Delivery (COD) orders are subject to verification before dispatch</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Tracking Your Order</h2>
              <p className="text-gray-700 mb-4">
                Once your order is shipped, you can track it using:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>The tracking link sent to your registered email and phone</li>
                <li>Our <a href="/track-order" className="text-[#7B1E3A] hover:underline">Track Order</a> page</li>
                <li>The courier partner's website with your tracking number</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">Important Notes</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Please ensure your delivery address and phone number are correct to avoid delays</li>
                <li>Someone should be available at the delivery address to receive the package</li>
                <li>If delivery fails twice, the order will be returned to us</li>
                <li>We are not responsible for delays due to unforeseen circumstances like natural disasters or strikes</li>
              </ul>
            </section>

            <section className="bg-[#F5F0E6] p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-[#7B1E3A] mb-4">Need Help?</h2>
              <p className="text-gray-700 mb-4">
                For any shipping-related queries, feel free to contact us:
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

