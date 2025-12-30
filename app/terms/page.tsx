export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7B1E3A] to-[#5C1629] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Terms & Conditions</h1>
          <p className="text-gray-200">Last updated: January 2025</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Shenique. These Terms and Conditions govern your use of our website and the purchase 
              of products from our online store. By accessing or using our website, you agree to be bound by 
              these terms.
            </p>
            <p className="text-gray-700">
              Please read these terms carefully before making any purchase. If you do not agree with any part 
              of these terms, you may not use our website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">2. Eligibility</h2>
            <p className="text-gray-700 mb-4">
              To use our website and make purchases, you must:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Be at least 18 years of age or have parental/guardian consent</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Provide accurate and complete information during registration and checkout</li>
              <li>Not use our website for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">3. Products and Pricing</h2>
            <p className="text-gray-700 mb-4">
              All products displayed on our website are subject to availability. We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Modify or discontinue products without prior notice</li>
              <li>Change prices at any time without notice</li>
              <li>Limit quantities of products purchased per customer</li>
              <li>Refuse or cancel orders at our discretion</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Product images are for illustration purposes only. Actual colors may vary slightly due to 
              monitor settings and photography conditions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">4. Orders and Payment</h2>
            <p className="text-gray-700 mb-4">
              When you place an order through our website:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>You are making an offer to purchase the products</li>
              <li>Order confirmation does not constitute acceptance until payment is verified</li>
              <li>We accept major credit/debit cards, UPI, net banking, and cash on delivery (where available)</li>
              <li>All payments are processed through secure payment gateways</li>
              <li>Prices include all applicable taxes unless otherwise stated</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">5. Shipping and Delivery</h2>
            <p className="text-gray-700 mb-4">
              Please refer to our <a href="/shipping" className="text-[#7B1E3A] hover:underline">Shipping Policy</a> for 
              detailed information about delivery timelines, shipping charges, and delivery areas.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              Please refer to our <a href="/returns" className="text-[#7B1E3A] hover:underline">Return Policy</a> for 
              detailed information about returns, exchanges, and refunds.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content on this website, including but not limited to text, graphics, logos, images, and 
              software, is the property of Shenique and is protected by intellectual property laws. You may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Copy, reproduce, or distribute any content without written permission</li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Modify or create derivative works from our content</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Shenique shall not be liable for any indirect, incidental, special, or consequential damages 
              arising from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use or inability to use our website</li>
              <li>Any products purchased through our website</li>
              <li>Unauthorized access to your personal information</li>
              <li>Errors, interruptions, or delays in service</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">9. Governing Law</h2>
            <p className="text-gray-700">
              These Terms and Conditions are governed by and construed in accordance with the laws of India. 
              Any disputes shall be subject to the exclusive jurisdiction of the courts in Delhi, India.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-[#F5F0E6] p-6 rounded-xl">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> hi@shenique.in</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> +91 8799718988 / +91 9315729367</p>
              <p className="text-gray-700"><strong>Hours:</strong> Monday to Saturday, 10 AM to 6 PM</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

