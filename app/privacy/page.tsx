export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7B1E3A] to-[#5C1629] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-200">Your privacy is important to us</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="text-gray-600 mb-8">Last updated: January 2025</p>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Shenique ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or make a purchase.
            </p>
            <p className="text-gray-700">
              By using our website, you consent to the data practices described in this policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3 mt-6">Personal Information</h3>
            <p className="text-gray-700 mb-4">
              We may collect the following personal information when you register, place an order, or contact us:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Name and contact information (email address, phone number)</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely through payment gateways)</li>
              <li>Account credentials (email and password)</li>
              <li>Order history and preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">
              When you visit our website, we automatically collect certain information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Browser type and version</li>
              <li>Device information and operating system</li>
              <li>IP address and location data</li>
              <li>Pages visited and time spent on our website</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations, shipping updates, and delivery notifications</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send promotional emails and newsletters (with your consent)</li>
              <li>Improve our website, products, and services</li>
              <li>Prevent fraudulent transactions and protect against illegal activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">4. Sharing Your Information</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your 
              information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> Shipping companies, payment processors, and other vendors who assist in our operations</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can control cookie settings through your browser preferences. Disabling cookies may affect 
              website functionality.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing through trusted gateways</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information by authorized personnel only</li>
            </ul>
            <p className="text-gray-700 mt-4">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee 
              absolute security of your data.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">7. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise any of these rights, please contact us at hi@shenique.in
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">8. Data Retention</h2>
            <p className="text-gray-700">
              We retain your personal information for as long as necessary to fulfill the purposes outlined 
              in this policy, unless a longer retention period is required by law. Account information is 
              retained until you request its deletion.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">9. Third-Party Links</h2>
            <p className="text-gray-700">
              Our website may contain links to third-party websites. We are not responsible for the privacy 
              practices of these external sites. We encourage you to read their privacy policies before 
              providing any personal information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700">
              Our website is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children. If we learn that we have collected information from a 
              child under 13, we will delete it promptly.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#7B1E3A] mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with 
              an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="bg-[#F5F0E6] p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-[#7B1E3A] mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> hi@shenique.in</p>
            <p className="text-gray-700 mb-2"><strong>Phone:</strong> +91 8799718988 / +91 9315729367</p>
            <p className="text-gray-700"><strong>Hours:</strong> Monday to Saturday, 10 AM to 6 PM</p>
          </section>
        </div>
      </main>
    </div>
  );
}

