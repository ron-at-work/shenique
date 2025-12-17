"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useProducts, useCategories } from "@/lib/hooks/useWooCommerce";

export default function Home() {
  const { data: productsData, loading: productsLoading } = useProducts();
  const { data: categoriesData, loading: categoriesLoading } = useCategories();

  // Default categories fallback
  const defaultCategories = [
    { 
      name: "Kurti", 
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&q=80",
      href: "/kurti",
      id: 0
    },
    { 
      name: "Woolen Kurti", 
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop&q=80",
      href: "/woolen-kurti",
      id: 0
    },
  ];

  // Transform WooCommerce categories to our format
  const categories = categoriesData && Array.isArray(categoriesData)
    ? categoriesData
        .filter((cat: any) => cat.count > 0) // Only show categories with products
        .slice(0, 2) // Limit to 2 categories
        .map((cat: any) => ({
          name: cat.name,
          image: cat.image?.src || defaultCategories[0].image,
          href: `/category/${cat.slug}`,
          id: cat.id
        }))
    : defaultCategories;

  // Transform WooCommerce products to our format
  const featuredProducts = productsData && Array.isArray(productsData)
    ? productsData.slice(0, 6).map((product: any) => {
        const regularPrice = parseFloat(product.regular_price || "0");
        const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
        const finalPrice = salePrice || regularPrice;
        const discountPercent = salePrice
          ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
          : 0;

        return {
          name: product.name,
          price: `₹${Math.round(finalPrice).toLocaleString()}`,
          originalPrice: salePrice ? `₹${Math.round(regularPrice).toLocaleString()}` : null,
          image: product.images?.[0]?.src || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop&q=80",
          href: `/product/${product.slug || product.id}`,
          id: product.id
        };
      })
    : [
        {
          name: "Elegant Floral Kurti",
          price: "₹1,299",
          originalPrice: "₹1,899",
          image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop&q=80",
          href: "/product/elegant-floral-kurti"
        },
        {
          name: "Designer Printed Kurti",
          price: "₹1,499",
          originalPrice: "₹2,199",
          image: "https://images.unsplash.com/photo-1564257577761-4e8938e885a6?w=600&h=800&fit=crop&q=80",
          href: "/product/designer-printed-kurti"
        },
        {
          name: "Woolen Winter Kurti",
          price: "₹1,799",
          originalPrice: "₹2,499",
          image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&q=80",
          href: "/product/woolen-winter-kurti"
        },
        {
          name: "Casual Comfort Kurti",
          price: "₹999",
          originalPrice: "₹1,499",
          image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&q=80",
          href: "/product/casual-comfort-kurti"
        },
        {
          name: "Party Wear Kurti",
          price: "₹1,899",
          originalPrice: "₹2,699",
          image: "https://images.unsplash.com/photo-1506629905607-0b8e0c5c0b5e?w=600&h=800&fit=crop&q=80",
          href: "/product/party-wear-kurti"
        },
        {
          name: "Premium Woolen Kurti",
          price: "₹2,199",
          originalPrice: "₹2,999",
          image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop&q=80",
          href: "/product/premium-woolen-kurti"
        },
      ];

  const collections = [
    { 
      name: "New Arrivals", 
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&q=80" 
    },
    { 
      name: "Festive Collection", 
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop&q=80" 
    },
    { 
      name: "Casual Wear", 
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&q=80" 
    },
    { 
      name: "Party Wear", 
      image: "https://images.unsplash.com/photo-1506629905607-0b8e0c5c0b5e?w=600&h=800&fit=crop&q=80" 
    },
  ];

  const reviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      text: "I've been shopping from Shenique for over 2 years. The quality is amazing and the prices are very reasonable. Love their kurtis!",
    },
    {
      name: "Anjali Patel",
      rating: 5,
      text: "The fabric quality is awesome. It feels so comfortable and soft. Both casual and ethnic wear are perfect. I Love Shenique!",
    },
    {
      name: "Riya Mehta",
      rating: 5,
      text: "I'm in love with this brand now. The quality of the clothes is top notch. The website is very user-friendly and easy to navigate.",
    },
    {
      name: "Kavya Reddy",
      rating: 5,
      text: "Shenique has been my first choice for buying kurtis. The color palette is always soothing! The fit is comfortable and fabric is breathable.",
    },
  ];

  // Banner carousel images
  const bannerImages = [
    {
      src: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1920&h=1080&fit=crop&q=80",
      alt: "Elegant Kurti Collection"
    },
    {
      src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1920&h=1080&fit=crop&q=80",
      alt: "Traditional Wear"
    },
    {
      src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1920&h=1080&fit=crop&q=80",
      alt: "Festive Collection"
    },
    {
      src: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1920&h=1080&fit=crop&q=80",
      alt: "Winter Woolen Kurtis"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Fixed Header */}
      <Header transparent />
      
      {/* Hero Carousel Section - full screen behind fixed header */}
      <section className="relative w-full h-screen">

        {/* Carousel Images */}
        <div className="relative w-full h-full overflow-hidden">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <main>

        {/* Shop by Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              SHOP BY CATEGORIES
            </h2>
            {categoriesLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading categories...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {categories.map((category: any) => (
                  <Link
                    key={category.id || category.name}
                    href={category.href}
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative h-64 md:h-80">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-semibold text-white group-hover:text-pink-300">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Special Offers */}
        <section className="py-16 bg-pink-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              SPECIAL OFFERS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">Buy 4 at ₹2199</h3>
                  <p className="text-sm opacity-90">Limited Time Offer</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">
                    Woolen Kurtis at ₹2299
                  </h3>
                  <p className="text-sm opacity-90">Best Deal</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-pink-500 to-red-500 p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">
                    Kurtis Under ₹1999
                  </h3>
                  <p className="text-sm opacity-90">Amazing Prices</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">Woolen Kurtis Under ₹1199</h3>
                  <p className="text-sm opacity-90">Shop Now</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              FEATURED PRODUCTS
            </h2>
            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product: any) => (
                  <Link
                    key={product.id || product.name}
                    href={product.href}
                    className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-pink-600 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl font-bold text-pink-600">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Shop by Collections */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              SHOP BY COLLECTIONS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {collections.map((collection) => (
                <Link
                  key={collection.name}
                  href={`/collections/${collection.name.toLowerCase().replace(" ", "-")}`}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-semibold text-white group-hover:text-pink-300">
                        {collection.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              CUSTOMER REVIEWS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="flex mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {review.text}
                  </p>
                  <p className="text-gray-800 font-semibold">— {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Shop The Best Women's Kurtis Via Shenique
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-4">
                Women love their kurtis, and no one understands this better
                than Shenique. With over 35 years of experience in creating the
                most magical kurtis and woolen kurtis for women, Shenique has earned the valuable
                trust of its customers.
              </p>
              <p className="mb-4">
                After a successful run offline, we have now extended our
                services online. Find the most exquisite kurtis and woolen kurtis
                online on our easy-to-navigate website. That's not all!
                Shenique has come up with an app to make online kurti shopping
                easier for you.
              </p>
              <p>
                So, don't wait up! Add your favourite kurtis to your shopping
                carts, and don't forget to avail our special discounts while you
                are at it.
              </p>
            </div>
          </div>
        </section>

        {/* Security Notice */}
        <section className="bg-yellow-50 border-y border-yellow-200 py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-700">
              ⚠️ Any call or message asking for advance/extra payment is a
              fraudulent request
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
