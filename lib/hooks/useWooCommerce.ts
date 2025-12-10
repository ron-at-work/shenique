/**
 * React hooks for WooCommerce API
 */

import { useState, useEffect } from 'react';

interface UseWooCommerceOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Hook to fetch products
 */
export function useProducts(options: UseWooCommerceOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/woocommerce/products');
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
  }, []);

  return { data, loading, error };
}

/**
 * Hook to fetch a single product
 */
export function useProduct(productId: string | number, options: UseWooCommerceOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/woocommerce/products?id=${productId}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch product');
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

    fetchProduct();
  }, [productId]);

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
        const response = await fetch('/api/woocommerce/categories');
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

