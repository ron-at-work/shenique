import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Discover */}
          <div>
            <h3 className="text-white font-semibold mb-4">Discover</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/new" className="hover:text-pink-400">
                  New
                </Link>
              </li>
              <li>
                <Link href="/kurti" className="hover:text-pink-400">
                  Kurti
                </Link>
              </li>
              <li>
                <Link href="/woolen-kurti" className="hover:text-pink-400">
                  Woolen Kurti
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="hover:text-pink-400">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/sale" className="hover:text-pink-400">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Experience */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Customer Experience
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about-us" className="hover:text-pink-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-pink-400">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-pink-400">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-pink-400">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-pink-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-pink-400">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="hover:text-pink-400">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p>
                <a
                  href="tel:+919899990772"
                  className="hover:text-pink-400"
                >
                  +91 9899990772
                </a>
              </p>
              <p>
                <a
                  href="mailto:care@shenique.in"
                  className="hover:text-pink-400"
                >
                  care@shenique.in
                </a>
              </p>
              <p className="mt-4">MONDAY to SATURDAY</p>
              <p>10 am to 6 pm</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Subscribe To Our Newsletter
            </h3>
            <p className="text-sm mb-4">
              Be the first to know about New Launches, Sales, Trend Updates &
              More
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2024 Shenique. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="hover:text-pink-400">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-pink-400">
                Privacy
              </Link>
              <Link href="/sitemap" className="hover:text-pink-400">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

