"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useProducts, useCategories } from "@/lib/hooks/useWooCommerce";
import { applyFiltersAndSort, getTotalSelectedFilters, type FilterState, type SortOption } from "@/lib/utils/productFilters";

// Filter options data
const filterOptions = {
  size: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
  colors: [
    { name: "Red", hex: "#DC2626" },
    { name: "Blue", hex: "#2563EB" },
    { name: "Green", hex: "#16A34A" },
    { name: "Yellow", hex: "#EAB308" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Purple", hex: "#9333EA" },
    { name: "Orange", hex: "#EA580C" },
    { name: "Black", hex: "#171717" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Maroon", hex: "#7F1D1D" },
  ],
  category: ["Straight Kurti", "A-Line Kurti", "Anarkali Kurti", "Kaftan Kurti", "Shirt Style Kurti", "Asymmetric Kurti"],
  fabric: ["Cotton", "Rayon", "Silk", "Georgette", "Crepe", "Chanderi", "Linen", "Viscose"],
  occasion: ["Casual", "Festive", "Party Wear", "Office Wear", "Wedding", "Daily Wear"],
  patternAndPrint: ["Solid", "Printed", "Embroidered", "Floral", "Geometric", "Abstract", "Checks", "Stripes"],
  price: [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹1500", min: 1000, max: 1500 },
    { label: "₹1500 - ₹2000", min: 1500, max: 2000 },
    { label: "Above ₹2000", min: 2000, max: 99999 },
  ],
  style: ["Casual", "Ethnic", "Indo-Western", "Contemporary", "Traditional"],
};

// Filter Section Component
function FilterSection({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-semibold text-gray-900 tracking-wide text-sm uppercase">
          {title}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const regularPrice = parseFloat(product.regular_price || "0");
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const finalPrice = salePrice || regularPrice;
  const discount = salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
  const image = product.images && product.images.length > 0 ? product.images[0].src : "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=900&fit=crop&q=80";
  const productSlug = product.slug || product.id;

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${productSlug}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {product.featured && (
            <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded">
              NEW
            </span>
          )}

          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isWishlisted ? 'bg-pink-600 text-white' : 'bg-white/90 text-gray-700 hover:bg-pink-600 hover:text-white'}`}
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

          <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium hover:bg-pink-600 hover:text-white transition-colors">
              Quick View
            </button>
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">₹{finalPrice.toLocaleString()}</span>
          {salePrice && (
            <>
              <span className="text-sm text-gray-500 line-through">₹{regularPrice.toLocaleString()}</span>
              <span className="text-sm text-green-600 font-medium">({discount}% off)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params?.slug as string;

  // Fetch categories to find the current category
  const { data: categoriesData, loading: categoriesLoading } = useCategories();
  
  // Find current category by slug
  const currentCategory = useMemo(() => {
    if (!categoriesData || !Array.isArray(categoriesData)) return null;
    return categoriesData.find((cat: any) => 
      cat.slug?.toLowerCase() === categorySlug?.toLowerCase()
    );
  }, [categoriesData, categorySlug]);
  
  // Fetch products by category ID
  const { data: productsData, loading: productsLoading } = useProducts(
    currentCategory?.id ? { categoryId: currentCategory.id } : {}
  );
  
  // Products are already filtered by category from API
  const rawProducts = Array.isArray(productsData) ? productsData : [];

  const [openFilters, setOpenFilters] = useState({
    size: true,
    colors: false,
    category: false,
    fabric: false,
    occasion: false,
    patternAndPrint: false,
    price: false,
    style: false,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    size: [] as string[],
    colors: [] as string[],
    category: [] as string[],
    fabric: [] as string[],
    occasion: [] as string[],
    patternAndPrint: [] as string[],
    price: [] as string[],
    style: [] as string[],
  });

  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleFilter = (filterName: keyof typeof openFilters) => {
    setOpenFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const handleFilterChange = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      size: [],
      colors: [],
      category: [],
      fabric: [],
      occasion: [],
      patternAndPrint: [],
      price: [],
      style: [],
    });
  };

  // Apply filters and sorting to products
  const products = useMemo(() => {
    return applyFiltersAndSort(rawProducts, selectedFilters, sortBy as SortOption, filterOptions.price);
  }, [rawProducts, selectedFilters, sortBy]);

  const totalSelectedFilters = getTotalSelectedFilters(selectedFilters);

  // Loading state
  if (categoriesLoading || !currentCategory) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden">
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        </main>
      </div>
    );
  }

  // Category not found
  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden">
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <Link href="/" className="text-pink-600 hover:underline">
              Go back to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      <main className="container mx-auto px-4 py-3">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-600 hover:text-pink-600">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{currentCategory.name}</span>
        </nav>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 self-start sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="font-semibold text-gray-900 uppercase tracking-wide">Filter</span>
              </div>
              {totalSelectedFilters > 0 && (
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-pink-600 hover:underline"
                >
                  Clear All ({totalSelectedFilters})
                </button>
              )}
            </div>

            <FilterSection
              title="Size"
              isOpen={openFilters.size}
              onToggle={() => toggleFilter('size')}
            >
              <div className="flex flex-wrap gap-2">
                {filterOptions.size.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange('size', size)}
                    className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                      selectedFilters.size.includes(size)
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'border-gray-300 text-gray-700 hover:border-pink-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Colors"
              isOpen={openFilters.colors}
              onToggle={() => toggleFilter('colors')}
            >
              <div className="flex flex-wrap gap-2">
                {filterOptions.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleFilterChange('colors', color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedFilters.colors.includes(color.name)
                        ? 'border-pink-600 ring-2 ring-pink-600 ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Price"
              isOpen={openFilters.price}
              onToggle={() => toggleFilter('price')}
            >
              {filterOptions.price.map((price) => (
                <label key={price.label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.price.includes(price.label)}
                    onChange={() => handleFilterChange('price', price.label)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{price.label}</span>
                </label>
              ))}
            </FilterSection>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
                {currentCategory.name}
              </h1>
              {currentCategory.description && (
                <div className="text-gray-600 leading-relaxed">
                  <p className={showFullDescription ? '' : 'line-clamp-2'}>
                    {currentCategory.description.replace(/<[^>]*>/g, '')}
                  </p>
                  {currentCategory.description.length > 100 && (
                    <button 
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-gray-900 underline font-medium mt-1 hover:text-pink-600"
                    >
                      {showFullDescription ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <p className="text-gray-600">
                {productsLoading ? (
                  <span className="font-semibold text-gray-900">Loading...</span>
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">{products.length}</span>
                    {totalSelectedFilters > 0 && rawProducts.length !== products.length && (
                      <span className="text-gray-500"> of {rawProducts.length}</span>
                    )}
                  </>
                )}{' '}products
              </p>

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filter
              </button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 uppercase">Sort</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Discount</option>
                </select>
              </div>
            </div>

            {totalSelectedFilters > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(selectedFilters).map(([category, values]) =>
                  values.map((value) => (
                    <span
                      key={`${category}-${value}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm"
                    >
                      {value}
                      <button
                        onClick={() => handleFilterChange(category as keyof typeof selectedFilters, value)}
                        className="hover:text-pink-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))
                )}
              </div>
            )}

            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-10">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Sidebar */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <FilterSection
                title="Size"
                isOpen={openFilters.size}
                onToggle={() => toggleFilter('size')}
              >
                <div className="flex flex-wrap gap-2">
                  {filterOptions.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFilterChange('size', size)}
                      className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                        selectedFilters.size.includes(size)
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'border-gray-300 text-gray-700 hover:border-pink-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={clearAllFilters}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-pink-600 text-white rounded-lg font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

