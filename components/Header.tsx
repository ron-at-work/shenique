"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity,
    cartTotal,
    cartOriginalTotal,
    cartItemsCount 
  } = useCart();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    "Kurti",
    "Woolen Kurti",
  ];

  // Dynamic classes based on scroll state
  // Initial: transparent (home) or white (PLP)
  // On scroll: dark shade for both
  const textColor = isScrolled ? 'text-white' : (transparent ? 'text-white' : 'text-gray-700');
  const hoverColor = isScrolled ? 'hover:text-pink-300' : (transparent ? 'hover:text-pink-300' : 'hover:text-pink-600');
  const borderColor = isScrolled ? 'border-white/30' : (transparent ? 'border-white/30' : 'border-gray-200');

  return (
    <>
      {/* Fixed wrapper - always fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Top Banner */}
        <div className="bg-pink-600 text-white text-center py-2 text-sm">
          <p>
            BUY FOR MIN. ₹2499, GET FLAT ₹100 OFF | CODE: SALE100 | BUY FOR MIN.
            ₹2899, GET FLAT ₹200 OFF | CODE: SALE200
          </p>
        </div>

        {/* Main Header */}
        <header className={`transition-all duration-300 ${isScrolled ? 'bg-black/40 backdrop-blur-sm' : (transparent ? 'bg-transparent' : 'bg-white')}`}>
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className={`flex items-center justify-between py-4 ${borderColor} relative`}>
            {/* Left Nav */}
            <div className="flex items-center gap-6 text-sm relative z-20 pointer-events-auto">
              <Link
                href="/kurti"
                className={`${textColor} ${hoverColor} font-medium`}
              >
                Kurti
              </Link>
              <Link href="/woolen-kurti" className={`${textColor} ${hoverColor} font-medium`}>
                Woolen Kurti
              </Link>
              <Link
                href="/new-arrivals"
                className={`${isScrolled || transparent ? 'text-yellow-300 hover:text-yellow-200' : 'text-pink-600 hover:text-pink-700'} font-medium transition-colors duration-300`}
              >
                New Arrivals
              </Link>
            </div>

            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center group py-3 pointer-events-auto z-0">
              {/* Main Brand Name - Full Cursive */}
              <span className={`text-3xl md:text-4xl font-(family-name:--font-dancing) font-semibold bg-linear-to-r ${isScrolled || transparent ? 'from-white via-pink-200 to-white' : 'from-pink-600 via-pink-500 to-pink-600'} bg-clip-text text-transparent drop-shadow-sm transition-all duration-300`}>
                Shenique
              </span>
              {/* Decorative Line with Tagline */}
              <div className={`flex items-center gap-2 -mt-0.5`}>
                <div className={`w-6 h-px ${isScrolled || transparent ? 'bg-pink-300' : 'bg-pink-400'} transition-all duration-300`}></div>
                <span className={`${isScrolled || transparent ? 'text-pink-400' : 'text-pink-500'}`}>✦</span>
                <span className={`text-[8px] tracking-[0.15em] italic font-(family-name:--font-playfair) ${isScrolled || transparent ? 'text-pink-200' : 'text-gray-500'} transition-colors duration-300`}>
                  Grace in Every Curve
                </span>
                <span className={`${isScrolled || transparent ? 'text-pink-400' : 'text-pink-500'}`}>✦</span>
                <div className={`w-6 h-px ${isScrolled || transparent ? 'bg-pink-300' : 'bg-pink-400'} transition-all duration-300`}></div>
              </div>
            </Link>

            {/* Right Nav */}
            <div className="flex items-center gap-4 relative z-20 pointer-events-auto">
              {/* User Menu */}
              <Link
                href="/auth/login"
                className={`${textColor} ${hoverColor} text-sm cursor-pointer hover:underline`}
              >
                Log In
              </Link>
              <Link
                href="/rewards"
                className={`${textColor} ${hoverColor} text-sm`}
              >
                Rewards
              </Link>
              {/* Wishlist */}
              <button className={`${textColor} ${hoverColor}`}>
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={`${textColor} ${hoverColor} relative`}
              >
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center py-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${textColor} mr-4`}
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
          </div>
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
              <Link
                href="/rewards"
                className="block py-2 text-gray-700 hover:text-pink-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Rewards
              </Link>
              <div className="border-t mt-2 pt-2">
                <Link
                  href="/auth/login"
                  className="block py-2 text-pink-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In / Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Cart Sidebar */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 transition-opacity"
              onClick={() => setIsCartOpen(false)}
            />
            
            {/* Cart Drawer */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                  {cartItemsCount > 0 && (
                    <span className="bg-pink-600 text-white text-sm px-2 py-0.5 rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-380px)]">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Looks like you have not added anything yet</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        {/* Product Image */}
                        <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-1 mb-0.5">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">Size: {item.size}</p>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-gray-900 text-sm">₹{item.price.toLocaleString()}</span>
                            <span className="text-xs text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Scroll Indicator */}
                    {cartItems.length > 2 && (
                      <div className="text-center py-2 text-xs text-gray-400 flex items-center justify-center gap-1">
                        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Scroll for more items
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="border-t p-3 space-y-3 bg-white shrink-0">
                  {/* Coupon Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button className="px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                      Apply
                    </button>
                  </div>

                  {/* Price Summary - Compact */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItemsCount} items)</span>
                      <span>₹{cartOriginalTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{(cartOriginalTotal - cartTotal).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons - Compact */}
                  <div className="space-y-2">
                    <Link
                      href="/checkout"
                      className="block w-full bg-pink-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-pink-700 transition-colors"
                      onClick={() => setIsCartOpen(false)}
                    >
                      PROCEED TO CHECKOUT
                    </Link>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-2 text-gray-700 text-sm font-medium hover:text-pink-600 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Trust Badges - Single Line */}
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Secure
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      COD Available
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </header>
      </div>
      
      {/* Spacer for fixed header on non-transparent pages */}
      {!transparent && <div className="h-[90px]" />}
    </>
  );
}
