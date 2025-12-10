"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProduct } from "@/lib/hooks/useWooCommerce";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [selectedSize, setSelectedSize] = useState("XS");
  const [pincode, setPincode] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: false,
    styleNotes: false,
    sizeFit: false,
    material: false,
    specifications: false,
  });

  // Try to fetch product from WooCommerce if product ID is in slug
  // Otherwise use static data
  const productId = slug.match(/\d+/)?.[0];
  const { data: wooProduct, loading: productLoading } = useProduct(productId || "", {
    onError: () => {
      // Silently fail and use static data
    },
  });

  // Default/fallback product data
  const defaultProduct = {
    title: "Maroon Embroidered Silk Straight Kurta",
    sku: "58138RR-XS",
    originalPrice: 2799,
    discountedPrice: 819,
    discountPercent: 71,
    images: [
      "https://shenique.in/wp-content/uploads/2025/09/neer1.png",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "This elegant maroon straight-cut kurta features intricate silver embroidery around the neckline and cuffs. Made from premium silk fabric, it offers a comfortable fit and timeless appeal. Perfect for festive occasions and special events.",
    styleNotes: "Pair this kurta with light-colored straight pants or palazzos. Accessorize with silver jewelry to complement the embroidery. The straight cut provides a relaxed, comfortable fit suitable for all body types.",
    sizeFit: "This kurta has a straight, relaxed fit. The length extends to just above the ankles. Available in sizes XS to XXL. Please refer to the size chart for accurate measurements.",
    material: "100% Premium Silk. The fabric is soft, breathable, and easy to maintain. Hand wash recommended for best results.",
    specifications: {
      "Fabric": "Silk",
      "Care Instructions": "Hand Wash",
      "Pattern": "Embroidered",
      "Neck": "Round Neck",
      "Sleeve": "Three-Quarter Sleeves",
      "Fit": "Straight Fit",
      "Occasion": "Festive, Casual",
    },
  };

  // Use WooCommerce product data if available, otherwise use default
  const product = wooProduct
    ? {
        title: wooProduct.name || defaultProduct.title,
        sku: wooProduct.sku || defaultProduct.sku,
        originalPrice: parseFloat(wooProduct.regular_price || "0") * 100,
        discountedPrice: parseFloat(wooProduct.sale_price || wooProduct.regular_price || "0") * 100,
        discountPercent: wooProduct.sale_price
          ? Math.round(
              ((parseFloat(wooProduct.regular_price) - parseFloat(wooProduct.sale_price)) /
                parseFloat(wooProduct.regular_price)) *
                100
            )
          : 0,
        images:
          wooProduct.images?.map((img: any) => img.src) || defaultProduct.images,
        sizes: wooProduct.attributes?.find((attr: any) => attr.name === "Size")?.options || defaultProduct.sizes,
        description: wooProduct.description || defaultProduct.description,
        styleNotes: wooProduct.short_description || defaultProduct.styleNotes,
        sizeFit: defaultProduct.sizeFit,
        material: defaultProduct.material,
        specifications: defaultProduct.specifications,
      }
    : defaultProduct;

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePincodeCheck = () => {
    // Handle pincode check logic here
    console.log("Checking delivery for pincode:", pincode);
  };

  const handleAddToCart = async () => {
    if (wooProduct?.id) {
      try {
        const response = await fetch("/api/woocommerce/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: wooProduct.id,
            quantity: 1,
          }),
        });
        const result = await response.json();
        if (response.ok) {
          alert("Product added to cart!");
        } else {
          alert("Failed to add to cart: " + (result.error || "Unknown error"));
        }
      } catch (error) {
        alert("Failed to add to cart. Please try again.");
      }
    } else {
      alert("Product added to cart! (Demo mode)");
    }
  };

  if (productLoading && productId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading product...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm text-gray-600">
              <Link href="/" className="hover:text-pink-600">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/kurti" className="hover:text-pink-600">
                Kurta And Kurtis for Women
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Maroon Embroidered...</span>
            </nav>
          </div>
        </div>

        {/* Product Detail Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Product Images */}
              <div className="space-y-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Right Side - Product Details */}
              <div className="space-y-6">
                {/* Product Title */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <p className="text-gray-600 text-sm">SKU: {product.sku}</p>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-lg font-semibold text-pink-600">
                    {product.discountPercent}% Off
                  </span>
                </div>
                <p className="text-sm text-gray-600">Inclusive Of All Taxes</p>

                {/* Size Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-lg font-semibold text-gray-900">
                      Size:
                    </label>
                    <Link
                      href="#size-chart"
                      className="text-sm text-pink-600 hover:underline"
                    >
                      View Size Chart
                    </Link>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                          selectedSize === size
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors uppercase"
                >
                  ADD TO CART
                </button>

                {/* Delivery Information */}
                <div className="border-t pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Delivery For
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter your Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={handlePincodeCheck}
                        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
                      >
                        CHECK
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        Express Shipping
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        Cash on Delivery Available
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        Easy 7 Days Return Policy
                      </span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Sections */}
                <div className="border-t pt-6 space-y-2">
                  {/* Description */}
                  <div className="border-b">
                    <button
                      onClick={() => toggleSection("description")}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="font-semibold text-gray-900">
                        DESCRIPTION
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          openSections.description ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openSections.description && (
                      <div className="pb-4 text-gray-600">
                        {product.description}
                      </div>
                    )}
                  </div>

                  {/* Style Notes */}
                  <div className="border-b">
                    <button
                      onClick={() => toggleSection("styleNotes")}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="font-semibold text-gray-900">
                        STYLE NOTES
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          openSections.styleNotes ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openSections.styleNotes && (
                      <div className="pb-4 text-gray-600">
                        {product.styleNotes}
                      </div>
                    )}
                  </div>

                  {/* Size & Fit */}
                  <div className="border-b">
                    <button
                      onClick={() => toggleSection("sizeFit")}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="font-semibold text-gray-900">
                        SIZE & FIT
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          openSections.sizeFit ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openSections.sizeFit && (
                      <div className="pb-4 text-gray-600">
                        {product.sizeFit}
                      </div>
                    )}
                  </div>

                  {/* Material */}
                  <div className="border-b">
                    <button
                      onClick={() => toggleSection("material")}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="font-semibold text-gray-900">
                        MATERIAL
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          openSections.material ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openSections.material && (
                      <div className="pb-4 text-gray-600">
                        {product.material}
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="border-b">
                    <button
                      onClick={() => toggleSection("specifications")}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="font-semibold text-gray-900">
                        SPECIFICATIONS
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          openSections.specifications ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openSections.specifications && (
                      <div className="pb-4">
                        <dl className="space-y-2">
                          {Object.entries(product.specifications).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between border-b pb-2"
                              >
                                <dt className="font-medium text-gray-700">
                                  {key}:
                                </dt>
                                <dd className="text-gray-600">{value}</dd>
                              </div>
                            )
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

