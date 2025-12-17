/**
 * React hooks for WooCommerce API
 */

import { useState, useEffect } from 'react';

interface UseWooCommerceOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Hook to fetch products by category
 * @param categoryId - Category ID to filter products (WooCommerce API accepts category ID)
 * @param options - Additional options
 */
export function useProductsByCategory(
  categoryId: number | string,
  options: UseWooCommerceOptions = {}
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!categoryId) return;

    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/woocommerce/products?category=${categoryId}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch products');
        }
        
        setData(result);
        options.onSuccess?.(result);
      } catch (err: any) {
        setError(err);
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId]);

  return { data, loading, error };
}

/**
 * Hook to fetch products (all products or by category)
 * @param options - Options including categoryId or categorySlug
 */
export function useProducts(options: UseWooCommerceOptions & { categoryId?: number | string; categorySlug?: string } = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { categoryId, categorySlug, onSuccess, onError } = options;

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // Build query params
        const params = new URLSearchParams();
        if (categoryId) {
          params.append('category', categoryId.toString());
        }
        
        const queryString = params.toString();
        const url = `/api/woocommerce/products${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch products');
        }
        
        // If categorySlug is provided, filter by slug on client side
        let filteredData = result;
        if (categorySlug && Array.isArray(result)) {
          filteredData = result.filter((product: any) => {
            const categories = product.categories || [];
            return categories.some((cat: any) => 
              cat.slug?.toLowerCase() === categorySlug.toLowerCase() ||
              cat.slug?.toLowerCase().includes(categorySlug.toLowerCase())
            );
          });
        }
        
        setData(filteredData);
        onSuccess?.(filteredData);
      } catch (err: any) {
        setError(err);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId, categorySlug]);

  return { data, loading, error };
}

/**
 * Hook to fetch a single product by ID or slug
 */
export function useProduct(productIdOrSlug: string | number, options: UseWooCommerceOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!productIdOrSlug) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        // Check if it's a number (ID) or string (slug)
        const isNumeric = !isNaN(Number(productIdOrSlug));
        const param = isNumeric ? `id=${productIdOrSlug}` : `slug=${productIdOrSlug}`;
        const response = await fetch(`/api/woocommerce/products?${param}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch product');
        }
        
        // If slug search, result is an array, get first item
        const product = Array.isArray(result) ? result[0] : result;
        setData(product);
        options.onSuccess?.(product);
      } catch (err: any) {
        setError(err);
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productIdOrSlug]);

  return { data, loading, error };
}

/**
 * Hook to fetch categories
 */
export function useCategories(options: UseWooCommerceOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await fetch('/api/woocommerce/products/categories');
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch categories');
        }
        
        setData(result);
        options.onSuccess?.(result);
      } catch (err: any) {
        setError(err);
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { data, loading, error };
}

/**
 * Hook to fetch cart
 */
export function useCart(options: UseWooCommerceOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        setLoading(true);
        const response = await fetch('/api/woocommerce/cart');
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch cart');
        }
        
        setData(result);
        options.onSuccess?.(result);
      } catch (err: any) {
        setError(err);
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch('/api/woocommerce/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add to cart');
      }
      
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      setError(err);
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, addToCart };
}

/**
 * Hook to fetch multiple products by their IDs
 * @param productIds - Array of product IDs to fetch
 * @param options - Additional options
 */
export function useProductsByIds(
  productIds: number[],
  options: UseWooCommerceOptions = {}
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!productIds || productIds.length === 0) {
      setData([]);
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        setLoading(true);
        
        // Fetch all products by IDs in parallel
        const promises = productIds.map(async (id) => {
          try {
            const response = await fetch(`/api/woocommerce/products?id=${id}`);
            const result = await response.json();
            
            if (!response.ok) {
              console.warn(`Failed to fetch product ${id}:`, result.error);
              return null;
            }
            
            // Handle both single product and array response
            return Array.isArray(result) ? result[0] : result;
          } catch (err) {
            console.warn(`Error fetching product ${id}:`, err);
            return null;
          }
        });
        
        const results = await Promise.all(promises);
        // Filter out null values (failed fetches)
        const validProducts = results.filter((product) => product !== null);
        
        setData(validProducts);
        options.onSuccess?.(validProducts);
      } catch (err: any) {
        setError(err);
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [productIds.join(',')]); // Re-fetch if IDs change

  return { data, loading, error };
}

