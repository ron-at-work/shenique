"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartOriginalTotal, cartItemsCount, updateQuantity, removeFromCart } = useCart();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: false,
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const shippingCost = cartTotal >= 999 ? 0 : 99;
  const finalTotal = cartTotal + shippingCost - couponDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleApplyCoupon = () => {
    // Demo coupon logic
    if (couponCode.toUpperCase() === "SALE100" && cartTotal >= 2499) {
      setCouponDiscount(100);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === "SALE200" && cartTotal >= 2899) {
      setCouponDiscount(200);
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code or minimum order value not met");
    }
  };

  const validateAddress = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"];
    for (const field of required) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    if (!/^\d{10}$/.test(shippingAddress.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      alert("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateAddress()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate order ID
    const newOrderId = "SHN" + Date.now().toString().slice(-8);
    setOrderId(newOrderId);
    setOrderPlaced(true);
    setStep(3);
    setIsProcessing(false);
    window.scrollTo(0, 0);
  };

  // Order Confirmation View
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Animation */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-2">Thank you for shopping with Shenique</p>
            <p className="text-lg font-medium text-gray-900 mb-8">Order ID: <span className="text-pink-600">{orderId}</span></p>

            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cartItemsCount})</span>
                  <span>₹{cartOriginalTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{(cartOriginalTotal - cartTotal + couponDiscount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Total Paid</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-4">Delivery Address</h2>
              <p className="text-gray-700">
                {shippingAddress.firstName} {shippingAddress.lastName}<br />
                {shippingAddress.address}{shippingAddress.apartment && `, ${shippingAddress.apartment}`}<br />
                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}<br />
                Phone: {shippingAddress.phone}
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Estimated Delivery:</span> 5-7 business days
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-2">Payment Method</h2>
              <p className="text-gray-700 capitalize">
                {paymentMethod === "cod" ? "Cash on Delivery" : 
                 paymentMethod === "upi" ? "UPI Payment" :
                 paymentMethod === "card" ? "Credit/Debit Card" : "Net Banking"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/orders"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                View Orders
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty Cart View
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to checkout</p>
            <Link
              href="/kurti"
              className="inline-block px-8 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-600 hover:text-pink-600">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/cart" className="text-gray-600 hover:text-pink-600">Cart</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <span className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-pink-600' : 'text-gray-600'}`}>Address</span>
          </div>
          <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-200'}`} />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <span className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-pink-600' : 'text-gray-600'}`}>Payment</span>
          </div>
          <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-pink-600' : 'bg-gray-200'}`} />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
            <span className={`ml-2 text-sm font-medium ${step >= 3 ? 'text-pink-600' : 'text-gray-600'}`}>Confirm</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingAddress.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingAddress.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="House no., Building, Street, Area"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, Suite, etc. (Optional)</label>
                    <input
                      type="text"
                      name="apartment"
                      value={shippingAddress.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Apartment, suite, unit, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="saveAddress"
                      checked={shippingAddress.saveAddress}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">Save this address for future orders</span>
                  </label>
                </div>

                <button
                  onClick={handleContinueToPayment}
                  className="w-full mt-6 py-4 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-pink-600 text-sm font-medium hover:underline"
                  >
                    Edit Address
                  </button>
                </div>

                {/* Delivery Address Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Delivering to:</p>
                  <p className="font-medium text-gray-900">
                    {shippingAddress.firstName} {shippingAddress.lastName}, {shippingAddress.address}, {shippingAddress.city} - {shippingAddress.pincode}
                  </p>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-pink-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-pink-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">UPI</p>
                      <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm, etc.</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">G</div>
                      <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">P</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-pink-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Credit / Debit Card</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Rupay</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">V</div>
                      <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">M</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'netbanking' ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="netbanking"
                      checked={paymentMethod === "netbanking"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-pink-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Net Banking</p>
                      <p className="text-sm text-gray-500">All major banks supported</p>
                    </div>
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </label>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full mt-6 py-4 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:bg-pink-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Place Order - ₹${finalTotal.toLocaleString()}`
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="border-t pt-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  >
                    {couponApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-green-600 mt-2">Coupon applied! You saved ₹{couponDiscount}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{cartOriginalTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Product Discount</span>
                  <span>-₹{(cartOriginalTotal - cartTotal).toLocaleString()}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost}`}</span>
                </div>
                {cartTotal < 999 && (
                  <p className="text-xs text-gray-500">Add ₹{999 - cartTotal} more for free shipping</p>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Easy Returns
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Free Shipping 999+
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    COD Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

