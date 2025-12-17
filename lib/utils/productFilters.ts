/**
 * Product Filtering and Sorting Utilities
 * Handles all frontend filtering and sorting logic for product listing pages
 */

export interface FilterState {
  size: string[];
  colors: string[];
  category: string[];
  fabric: string[];
  occasion: string[];
  patternAndPrint: string[];
  price: string[];
  style: string[];
}

export type SortOption = 
  | "featured" 
  | "newest" 
  | "price-low" 
  | "price-high" 
  | "discount" 
  | "popularity";

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

/**
 * Get product price (handles sale price and regular price)
 */
export function getProductPrice(product: any): number {
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const regularPrice = parseFloat(product.regular_price || "0");
  return salePrice || regularPrice;
}

/**
 * Get product discount percentage
 */
export function getProductDiscount(product: any): number {
  const regularPrice = parseFloat(product.regular_price || "0");
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  if (!salePrice || regularPrice === 0) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

/**
 * Check if product matches price filter
 */
function matchesPriceFilter(product: any, priceFilters: string[], priceRanges: PriceRange[]): boolean {
  if (priceFilters.length === 0) return true;
  
  const productPrice = getProductPrice(product);
  
  return priceFilters.some(filterLabel => {
    const range = priceRanges.find(r => r.label === filterLabel);
    if (!range) return false;
    return productPrice >= range.min && productPrice <= range.max;
  });
}

/**
 * Check if product matches attribute filter
 * Checks product attributes, tags, and categories
 */
function matchesAttributeFilter(
  product: any, 
  filterValues: string[], 
  attributeName: string
): boolean {
  if (filterValues.length === 0) return true;
  
  // Check product attributes
  if (product.attributes && Array.isArray(product.attributes)) {
    const matchingAttr = product.attributes.find((attr: any) => 
      attr.name?.toLowerCase() === attributeName.toLowerCase()
    );
    
    if (matchingAttr && matchingAttr.options) {
      const attrValues = matchingAttr.options.map((opt: string) => opt.toLowerCase());
      return filterValues.some(filter => 
        attrValues.some((val: string) => val.includes(filter.toLowerCase()))
      );
    }
  }
  
  // Check tags
  if (product.tags && Array.isArray(product.tags)) {
    const tagNames = product.tags.map((tag: any) => 
      (tag.name || tag).toLowerCase()
    );
    return filterValues.some(filter => 
      tagNames.some((tag: string) => tag.includes(filter.toLowerCase()))
    );
  }
  
  // Check categories for style/occasion
  if ((attributeName === 'style' || attributeName === 'occasion') && product.categories) {
    const categoryNames = product.categories.map((cat: any) => 
      (cat.name || '').toLowerCase()
    );
    return filterValues.some(filter => 
      categoryNames.some((cat: string) => cat.includes(filter.toLowerCase()))
    );
  }
  
  return false;
}

/**
 * Check if product matches size filter
 */
function matchesSizeFilter(product: any, sizeFilters: string[]): boolean {
  if (sizeFilters.length === 0) return true;
  
  // Check product attributes for size
  if (product.attributes && Array.isArray(product.attributes)) {
    const sizeAttr = product.attributes.find((attr: any) => 
      attr.name?.toLowerCase() === 'size' || attr.name?.toLowerCase() === 'pa_size'
    );
    
    if (sizeAttr && sizeAttr.options) {
      const availableSizes = sizeAttr.options.map((opt: string) => opt.toUpperCase());
      return sizeFilters.some(size => availableSizes.includes(size.toUpperCase()));
    }
  }
  
  // Check variations for size
  if (product.variations && Array.isArray(product.variations)) {
    const variationSizes = product.variations
      .map((variation: any) => {
        if (variation.attributes && Array.isArray(variation.attributes)) {
          const sizeAttr = variation.attributes.find((attr: any) => 
            attr.name?.toLowerCase() === 'size' || attr.name?.toLowerCase() === 'pa_size'
          );
          return sizeAttr?.option?.toUpperCase();
        }
        return null;
      })
      .filter(Boolean);
    
    return sizeFilters.some(size => variationSizes.includes(size.toUpperCase()));
  }
  
  return false;
}

/**
 * Check if product matches color filter
 */
function matchesColorFilter(product: any, colorFilters: string[]): boolean {
  if (colorFilters.length === 0) return true;
  
  // Check product attributes for color
  if (product.attributes && Array.isArray(product.attributes)) {
    const colorAttr = product.attributes.find((attr: any) => 
      attr.name?.toLowerCase() === 'color' || 
      attr.name?.toLowerCase() === 'colour' ||
      attr.name?.toLowerCase() === 'pa_color'
    );
    
    if (colorAttr && colorAttr.options) {
      const availableColors = colorAttr.options.map((opt: string) => opt.toLowerCase());
      return colorFilters.some(color => 
        availableColors.some((c: string) => c.includes(color.toLowerCase()))
      );
    }
  }
  
  // Check tags for color
  if (product.tags && Array.isArray(product.tags)) {
    const tagNames = product.tags.map((tag: any) => 
      (tag.name || tag).toLowerCase()
    );
    return colorFilters.some(color => 
      tagNames.some((tag: string) => tag.includes(color.toLowerCase()))
    );
  }
  
  return false;
}

/**
 * Filter products based on selected filters
 */
export function filterProducts(
  products: any[],
  filters: FilterState,
  priceRanges: PriceRange[]
): any[] {
  if (!Array.isArray(products)) return [];
  
  return products.filter(product => {
    // Size filter
    if (!matchesSizeFilter(product, filters.size)) return false;
    
    // Color filter
    if (!matchesColorFilter(product, filters.colors)) return false;
    
    // Price filter
    if (!matchesPriceFilter(product, filters.price, priceRanges)) return false;
    
    // Category filter (product subcategories)
    if (filters.category.length > 0) {
      if (!matchesAttributeFilter(product, filters.category, 'category')) return false;
    }
    
    // Fabric filter
    if (filters.fabric.length > 0) {
      if (!matchesAttributeFilter(product, filters.fabric, 'fabric')) return false;
    }
    
    // Occasion filter
    if (filters.occasion.length > 0) {
      if (!matchesAttributeFilter(product, filters.occasion, 'occasion')) return false;
    }
    
    // Pattern and Print filter
    if (filters.patternAndPrint.length > 0) {
      if (!matchesAttributeFilter(product, filters.patternAndPrint, 'pattern')) return false;
    }
    
    // Style filter
    if (filters.style.length > 0) {
      if (!matchesAttributeFilter(product, filters.style, 'style')) return false;
    }
    
    return true;
  });
}

/**
 * Sort products based on sort option
 */
export function sortProducts(products: any[], sortBy: SortOption): any[] {
  if (!Array.isArray(products)) return [];
  
  const sorted = [...products];
  
  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => {
        const priceA = getProductPrice(a);
        const priceB = getProductPrice(b);
        return priceA - priceB;
      });
      
    case "price-high":
      return sorted.sort((a, b) => {
        const priceA = getProductPrice(a);
        const priceB = getProductPrice(b);
        return priceB - priceA;
      });
      
    case "discount":
      return sorted.sort((a, b) => {
        const discountA = getProductDiscount(a);
        const discountB = getProductDiscount(b);
        return discountB - discountA;
      });
      
    case "newest":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.date_created || a.date_created_gmt || 0).getTime();
        const dateB = new Date(b.date_created || b.date_created_gmt || 0).getTime();
        return dateB - dateA;
      });
      
    case "popularity":
      // Sort by total_sales if available, otherwise by featured
      return sorted.sort((a, b) => {
        const salesA = parseInt(a.total_sales || "0");
        const salesB = parseInt(b.total_sales || "0");
        if (salesA !== salesB) return salesB - salesA;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
      
    case "featured":
    default:
      // Featured first, then by date (newest)
      return sorted.sort((a, b) => {
        const featuredA = a.featured ? 1 : 0;
        const featuredB = b.featured ? 1 : 0;
        if (featuredA !== featuredB) return featuredB - featuredA;
        const dateA = new Date(a.date_created || a.date_created_gmt || 0).getTime();
        const dateB = new Date(b.date_created || b.date_created_gmt || 0).getTime();
        return dateB - dateA;
      });
  }
}

/**
 * Apply both filtering and sorting to products
 */
export function applyFiltersAndSort(
  products: any[],
  filters: FilterState,
  sortBy: SortOption,
  priceRanges: PriceRange[]
): any[] {
  const filtered = filterProducts(products, filters, priceRanges);
  return sortProducts(filtered, sortBy);
}

/**
 * Get total count of selected filters
 */
export function getTotalSelectedFilters(filters: FilterState): number {
  return Object.values(filters).flat().length;
}

