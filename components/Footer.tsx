"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCategories } from "@/lib/hooks/useWooCommerce";

export default function Footer() {
  const { data: categoriesData, loading: categoriesLoading } = useCategories();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (categoriesData && Array.isArray(categoriesData)) {
      // Filter categories with products and map to links
      const filteredCategories = categoriesData
        .filter((cat: any) => cat.count > 0 && cat.slug !== 'uncategorized')
        .map((cat: any) => ({
          name: cat.name,
          slug: cat.slug,
          href: `/category/${cat.slug}`,
        }));
      setCategories(filteredCategories);
    }
  }, [categoriesData]);

  return (
    <footer className="bg-gray-900 text-gray-300 overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Discover */}
          <div>
            <h3 className="text-white font-semibold mb-4">Discover</h3>
            {categoriesLoading ? (
              <ul className="space-y-2 text-sm">
                <li className="text-gray-500">Loading...</li>
              </ul>
            ) : categories.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={category.href} className="hover:text-pink-400">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2 text-sm">
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
              </ul>
            )}
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
                  href="tel:+918799718988"
                  className="hover:text-pink-400"
                >
                  +91 8799718988
                </a>
              </p>
              <p>
                <a
                  href="tel:+919315729367"
                  className="hover:text-pink-400"
                >
                  +91 9315729367
                </a>
              </p>
              <p>
                <a
                  href="mailto:hi@shenique.in"
                  className="hover:text-pink-400"
                >
                  hi@shenique.in
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
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shrink-0 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.instagram.com/shenique.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2026 Shenique. All rights reserved.
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

