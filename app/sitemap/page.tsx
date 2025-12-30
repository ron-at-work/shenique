import Link from "next/link";

export default function SitemapPage() {
  const sitemapData = [
    {
      title: "Shop",
      links: [
        { name: "All Kurtis", href: "/kurti" },
        { name: "Woolen Kurti", href: "/woolen-kurti" },
        { name: "New Arrivals", href: "/new-arrivals" },
      ],
    },
    {
      title: "Collections",
      links: [
        { name: "Festive Collection", href: "/collections/festive-collection" },
        { name: "Casual Wear", href: "/collections/casual-wear" },
        { name: "Party Wear", href: "/collections/party-wear" },
        { name: "Office Wear", href: "/collections/office-wear" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Track Order", href: "/track-order" },
        { name: "Store Locator", href: "/store-locator" },
        { name: "My Orders", href: "/orders" },
      ],
    },
    {
      title: "Policies",
      links: [
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Shipping Policy", href: "/shipping" },
        { name: "Return Policy", href: "/returns" },
      ],
    },
    {
      title: "About",
      links: [
        { name: "About Us", href: "/about-us" },
        { name: "Our Story", href: "/about-us" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Login", href: "/auth/login" },
        { name: "Sign Up", href: "/auth/signup" },
        { name: "Forgot Password", href: "/auth/forgot-password" },
        { name: "Rewards", href: "/rewards" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7B1E3A] to-[#5C1629] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Sitemap</h1>
          <p className="text-gray-200">Navigate through our website easily</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Home Link */}
          <div className="mb-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[#7B1E3A] hover:underline font-medium text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home Page
            </Link>
          </div>

          {/* Sitemap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitemapData.map((section) => (
              <div key={section.title} className="bg-[#F5F0E6] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[#7B1E3A] mb-4 pb-2 border-b border-[#7B1E3A]/20">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="text-gray-700 hover:text-[#7B1E3A] transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 text-[#C9A14A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Can't find what you're looking for?{" "}
              <Link href="/contact" className="text-[#7B1E3A] hover:underline font-medium">
                Contact us
              </Link>{" "}
              and we'll help you out.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

