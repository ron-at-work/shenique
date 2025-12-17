"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Cart Item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  size?: string; // Optional - only if product has sizes
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartOriginalTotal: number;
  cartItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === newItem.id);
      if (existingIndex > -1) {
        // Replace quantity if item exists
        const updated = [...prev];
        updated[existingIndex].quantity = newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartOriginalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartOriginalTotal,
      cartItemsCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

