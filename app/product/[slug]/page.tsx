"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useProduct, useProducts } from "@/lib/hooks/useWooCommerce";
import HtmlRenderer from "@/components/HtmlRenderer";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart, setIsCartOpen } = useCart();
  const { data: wcProduct, loading, error } = useProduct(slug);
  
  // Fetch all products
  const { data: allProducts, loading: allProductsLoading } = useProducts();
  
  // Filter related products by matching IDs
  const relatedProducts = useMemo(() => {
    if (!wcProduct?.related_ids || !Array.isArray(allProducts)) {
      return [];
    }
    
    const relatedIds = wcProduct.related_ids;
    
    // Filter products that match related_ids
    return allProducts.filter((product: any) => 
      relatedIds.includes(product.id)
    );
  }, [wcProduct?.related_ids, allProducts]);
  
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    styleNotes: false,
    sizeFit: false,
    material: false,
    specifications: false,
  });

  // Transform WooCommerce product data to our format
  const product = useMemo(() => {
    if (!wcProduct) return null;

    const regularPrice = parseFloat(wcProduct.regular_price || "0");
    const salePrice = wcProduct.sale_price ? parseFloat(wcProduct.sale_price) : null;
    const finalPrice = salePrice || regularPrice;
    const discount = salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

    // Extract images
    const images = wcProduct.images && wcProduct.images.length > 0
      ? wcProduct.images.map((img: any) => img.src)
      : [wcProduct.image?.src || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop&q=80"];

    // Extract attributes (sizes, colors, etc.)
    const attributes = wcProduct.attributes || [];
    
    // Only get sizes if they exist in attributes
    const sizeAttribute = attributes.find((attr: any) => 
      attr.name?.toLowerCase() === 'size' || 
      attr.name?.toLowerCase() === 'pa_size'
    );
    const sizes = sizeAttribute?.options && sizeAttribute.options.length > 0 
      ? sizeAttribute.options 
      : [];
    
    // Only get colors if they exist in attributes
    const colorAttribute = attributes.find((attr: any) => 
      attr.name?.toLowerCase() === 'color' || 
      attr.name?.toLowerCase() === 'pa_color'
    );
    const colors = colorAttribute?.options && colorAttribute.options.length > 0
      ? colorAttribute.options.map((color: string) => {
          // Map color names to hex codes (you can expand this)
          const colorMap: Record<string, string> = {
            "maroon": "#7F1D1D",
            "navy": "#1E3A5F",
            "green": "#166534",
            "red": "#DC2626",
            "blue": "#2563EB",
            "pink": "#EC4899",
            "black": "#171717",
            "white": "#FFFFFF",
          };
          return { name: color, hex: colorMap[color.toLowerCase()] || "#7F1D1D" };
        })
      : [];

    // Extract category
    const category = wcProduct.categories && wcProduct.categories.length > 0
      ? wcProduct.categories[0].name
      : "Kurti";

    return {
      id: wcProduct.id,
      name: wcProduct.name,
      sku: wcProduct.sku || `PROD-${wcProduct.id}`,
      category: category,
      price: finalPrice,
      originalPrice: regularPrice,
      discount: discount,
      images: images,
      sizes: sizes,
      colors: colors,
      description: wcProduct.description || wcProduct.short_description || null,
      styleNotes: wcProduct.meta_data?.find((meta: any) => meta.key === 'style_notes')?.value || null,
      sizeFit: wcProduct.meta_data?.find((meta: any) => meta.key === 'size_fit')?.value || null,
      material: wcProduct.meta_data?.find((meta: any) => meta.key === 'material')?.value || wcProduct.attributes?.find((attr: any) => attr.name?.toLowerCase() === 'material')?.options?.[0] || null,
      specifications: (() => {
        const specs: Record<string, string> = {};
        // Only add specifications that have actual data
        const fabric = wcProduct.attributes?.find((attr: any) => attr.name?.toLowerCase() === 'fabric')?.options?.[0];
        if (fabric) specs["Fabric"] = fabric;
        
        const pattern = wcProduct.attributes?.find((attr: any) => attr.name?.toLowerCase() === 'pattern')?.options?.[0];
        if (pattern) specs["Pattern"] = pattern;
        
        const neck = wcProduct.attributes?.find((attr: any) => attr.name?.toLowerCase() === 'neck')?.options?.[0];
        if (neck) specs["Neck"] = neck;
        
        const sleeve = wcProduct.attributes?.find((attr: any) => attr.name?.toLowerCase() === 'sleeve')?.options?.[0];
        if (sleeve) specs["Sleeve"] = sleeve;
        
        const length = wcProduct.meta_data?.find((meta: any) => meta.key === 'length')?.value;
        if (length) specs["Length"] = length;
        
        const fit = wcProduct.attributes?.find((attr: any) => attr.name?.toLowerCase() === 'fit')?.options?.[0];
        if (fit) specs["Fit"] = fit;
        
        const occasion = wcProduct.attributes?.find((attr: any) => attr.name?.toLowerCase() === 'occasion')?.options?.[0];
        if (occasion) specs["Occasion"] = occasion;
        
        const washCare = wcProduct.meta_data?.find((meta: any) => meta.key === 'wash_care')?.value;
        if (washCare) specs["Wash Care"] = washCare;
        
        return specs;
      })(),
      rating: parseFloat(wcProduct.average_rating || "0"),
      reviewCount: parseInt(wcProduct.review_count || "0"),
      inStock: wcProduct.stock_status === "instock",
      relatedIds: wcProduct.related_ids || [],
    };
  }, [wcProduct]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePincodeCheck = () => {
    alert(`Checking delivery for pincode: ${pincode}`);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem: any = {
      id: `${product.id}${product.sizes && product.sizes.length > 0 ? `-${selectedSize}` : ''}`,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      quantity: quantity,
    };
    
    if (product.sizes && product.sizes.length > 0) {
      cartItem.size = selectedSize;
    }
    
    addToCart(cartItem);

    // Show notification
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 2000);
    
    // Open cart sidebar
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Add to cart first
    addToCart({
      id: `${product.id}${product.sizes && product.sizes.length > 0 ? `-${selectedSize}` : ''}`,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      ...(product.sizes && product.sizes.length > 0 && { size: selectedSize }),
      quantity: quantity,
    });
    
    // Redirect to checkout
    router.push("/checkout");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load product</p>
              <Link href="/" className="text-pink-600 hover:underline">
                Go back to home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 py-6 overflow-x-hidden">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-600 hover:text-pink-600">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href={`/${product.category.toLowerCase()}`} className="text-gray-600 hover:text-pink-600">
            {product.category}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 group">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              
              {/* Discount Badge */}
              <span className="absolute top-4 left-4 bg-pink-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
                -{product.discount}%
              </span>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted ? 'bg-pink-600 text-white' : 'bg-white text-gray-700 hover:bg-pink-600 hover:text-white'
                } shadow-lg`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isWishlisted ? "currentColor" : "none"}
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

              {/* Image Navigation Arrows */}
              <button
                onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  onMouseEnter={() => setSelectedImage(index)}
                  className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'ring-2 ring-pink-600 ring-offset-2'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {(product.rating > 0 || product.reviewCount > 0) && (
                <div className="flex items-center gap-4">
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                  )}
                  {product.reviewCount > 0 && (
                    <span className="text-sm text-gray-500">({product.reviewCount} Reviews)</span>
                  )}
                </div>
              )}
              {product.sku && product.sku !== `PROD-${product.id}` && (
                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pb-4 border-b">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-lg font-semibold text-green-600">
                {product.discount}% Off
              </span>
            </div>
            <p className="text-sm text-gray-600 -mt-2">Inclusive of all taxes</p>

            {/* Color Selection - Only show if colors exist */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">
                  COLOR: <span className="font-normal text-gray-600">{product.colors[selectedColor]?.name}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color: { name: string; hex: string }, index: number) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(index)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        selectedColor === index
                          ? 'border-pink-600 ring-2 ring-pink-600 ring-offset-2'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection - Only show if sizes exist */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900">
                    SIZE: <span className="font-normal text-gray-600">{selectedSize}</span>
                  </label>
                  <button className="text-sm text-pink-600 hover:underline font-medium">
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-10 rounded-lg border-2 font-medium text-sm transition-all ${
                        selectedSize === size
                          ? "bg-pink-600 text-white border-pink-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-pink-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">QUANTITY</label>
              <div className="flex items-center gap-1 w-fit border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white text-pink-600 border-2 border-pink-600 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-colors"
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-700 transition-colors"
              >
                BUY NOW
              </button>
            </div>

            {/* Delivery Check */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                CHECK DELIVERY
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                />
                <button
                  onClick={handlePincodeCheck}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  CHECK
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
              <div className="flex flex-col items-center text-center gap-2">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-xs text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs text-gray-600">7 Days Return</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-xs text-gray-600">COD Available</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs text-gray-600">Secure Payment</span>
              </div>
            </div>

            {/* Collapsible Sections - Only show sections that have data */}
            <div className="space-y-0">
              {/* Description - Only show if description exists */}
              {product.description && (
                <div className="border-b">
                  <button
                    onClick={() => toggleSection("description")}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="font-semibold text-gray-900 uppercase text-sm tracking-wide">
                      Description
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${openSections.description ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSections.description && (
                    <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                      <HtmlRenderer html={product.description} className="text-gray-600" />
                    </div>
                  )}
                </div>
              )}

              {/* Style Notes - Only show if styleNotes exists */}
              {product.styleNotes && (
                <div className="border-b">
                  <button
                    onClick={() => toggleSection("styleNotes")}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="font-semibold text-gray-900 uppercase text-sm tracking-wide">
                      Style Notes
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${openSections.styleNotes ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSections.styleNotes && (
                    <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                      <HtmlRenderer html={product.styleNotes} className="text-gray-600" />
                    </div>
                  )}
                </div>
              )}

              {/* Size & Fit - Only show if sizeFit exists */}
              {product.sizeFit && (
                <div className="border-b">
                  <button
                    onClick={() => toggleSection("sizeFit")}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="font-semibold text-gray-900 uppercase text-sm tracking-wide">
                      Size & Fit
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${openSections.sizeFit ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSections.sizeFit && (
                    <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                      <HtmlRenderer html={product.sizeFit} className="text-gray-600" />
                    </div>
                  )}
                </div>
              )}

              {/* Material & Care - Only show if material exists */}
              {product.material && (
                <div className="border-b">
                  <button
                    onClick={() => toggleSection("material")}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="font-semibold text-gray-900 uppercase text-sm tracking-wide">
                      Material & Care
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${openSections.material ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSections.material && (
                    <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                      <HtmlRenderer html={product.material} className="text-gray-600" />
                    </div>
                  )}
                </div>
              )}

              {/* Specifications - Only show if specifications exist */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="border-b">
                  <button
                    onClick={() => toggleSection("specifications")}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="font-semibold text-gray-900 uppercase text-sm tracking-wide">
                      Specifications
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${openSections.specifications ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSections.specifications && (
                    <div className="pb-4">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="contents">
                            <dt className="text-gray-500">{key}</dt>
                            <dd className="text-gray-900">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* You May Also Like Section - Only show if related products exist */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            {allProductsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct: any) => {
                  const regularPrice = parseFloat(relatedProduct.regular_price || "0");
                  const salePrice = relatedProduct.sale_price ? parseFloat(relatedProduct.sale_price) : null;
                  const finalPrice = salePrice || regularPrice;
                  const discount = salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
                  const image = relatedProduct.images && relatedProduct.images.length > 0 
                    ? relatedProduct.images[0].src 
                    : "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&q=80";
                  const productSlug = relatedProduct.slug || relatedProduct.id;
                  
                  return (
                    <Link key={relatedProduct.id} href={`/product/${productSlug}`} className="group">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-3">
                        <Image
                          src={image}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {discount > 0 && (
                          <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-pink-600 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-gray-900">₹{finalPrice.toLocaleString()}</span>
                        {salePrice && (
                          <span className="text-sm text-gray-500 line-through">₹{regularPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Added to Cart Notification */}
      {showAddedNotification && (
        <div className="fixed top-24 right-4 z-[60] animate-in slide-in-from-top">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Added to cart!</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
