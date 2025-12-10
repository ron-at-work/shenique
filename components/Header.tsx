"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = [
    "Kurti",
    "Woolen Kurti",
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-pink-600 text-white text-center py-2 text-sm">
        <p>
          BUY FOR MIN. ₹2499, GET FLAT ₹100 OFF | CODE: SALE100 | BUY FOR MIN.
          ₹2899, GET FLAT ₹200 OFF | CODE: SALE200
        </p>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/store-locator"
                className="text-gray-700 hover:text-pink-600"
              >
                Store Locator
              </Link>
              <Link href="/sale" className="text-gray-700 hover:text-pink-600">
                Sale
              </Link>
              <Link
                href="/special-offers"
                className="text-gray-700 hover:text-pink-600"
              >
                Special Offers
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-pink-600 text-sm"
              >
                Log In
              </Link>
              <Link
                href="/rewards"
                className="text-gray-700 hover:text-pink-600 text-sm"
              >
                Rewards
              </Link>
            </div>
          </div>

          {/* Main Nav */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <Link href="/" className="text-2xl font-bold text-pink-600">
                Shenique
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for kurtis, woolen kurtis..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="text-gray-700 hover:text-pink-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="text-gray-700 hover:text-pink-600 relative"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Categories Nav */}
          <nav className="hidden lg:flex items-center gap-6 py-3 border-t">
            <Link
              href="/kurti"
              className="text-gray-700 hover:text-pink-600 font-medium"
            >
              Kurti
            </Link>
            <Link
              href="/woolen-kurti"
              className="text-gray-700 hover:text-pink-600 font-medium"
            >
              Woolen Kurti
            </Link>
            <Link
              href="/new-arrivals"
              className="text-pink-600 font-medium"
            >
              New Arrivals
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/${cat.toLowerCase().replace(" ", "-")}`}
                  className="block py-2 text-gray-700 hover:text-pink-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
              <Link
                href="/new-arrivals"
                className="block py-2 text-pink-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
            </div>
          </div>
        )}

        {/* Cart Sidebar */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="flex-1 bg-black/50"
              onClick={() => setIsCartOpen(false)}
            />
            <div className="w-96 bg-white shadow-xl">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
              <div className="p-8 text-center text-gray-500">
                <p>Your cart is currently empty.</p>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

