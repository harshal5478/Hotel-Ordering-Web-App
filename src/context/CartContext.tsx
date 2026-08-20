'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  tableId: string | null;
  tableNumber: number | null;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  orderNote: string;
  setOrderNote: (note: string) => void;
  setTableInfo: (id: string, number: number) => void;
  addToCart: (menuItem: MenuItem, quantity?: number, note?: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateItemNote: (menuItemId: string, note: string) => void;
  clearCart: () => void;
  getItemQuantity: (menuItemId: string) => number;
  totalItemsCount: number;
  subtotalAmount: number;
  recentOrderIds: string[];
  addRecentOrderId: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'hotel_qr_cart_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.cart)) return parsed.cart;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [tableId, setTableId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved).tableId || null;
    } catch {
      // ignore
    }
    return null;
  });

  const [tableNumber, setTableNumber] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved).tableNumber || null;
    } catch {
      // ignore
    }
    return null;
  });

  const [customerName, setCustomerName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved).customerName || '';
    } catch {
      // ignore
    }
    return '';
  });

  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved).customerPhone || '';
    } catch {
      // ignore
    }
    return '';
  });

  const [orderNote, setOrderNote] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved).orderNote || '';
    } catch {
      // ignore
    }
    return '';
  });

  const [recentOrderIds, setRecentOrderIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved).recentOrderIds || [];
    } catch {
      // ignore
    }
    return [];
  });

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({
          cart,
          tableId,
          tableNumber,
          customerName,
          customerPhone,
          orderNote,
          recentOrderIds,
        })
      );
    } catch (e) {
      console.error('Failed to save cart state to storage', e);
    }
  }, [cart, tableId, tableNumber, customerName, customerPhone, orderNote, recentOrderIds]);

  const setTableInfo = (id: string, number: number) => {
    setTableId(id);
    setTableNumber(number);
  };

  const addRecentOrderId = (id: string) => {
    setRecentOrderIds((prev) => {
      // Keep only last 10 orders to avoid blowing up storage
      const newOrders = [id, ...prev.filter(existing => existing !== id)].slice(0, 10);
      return newOrders;
    });
  };

  const addToCart = (menuItem: MenuItem, quantity = 1, note = '') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.menuItem.id === menuItem.id
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          item_note: note || updated[existingIndex].item_note,
        };
        return updated;
      }

      return [...prevCart, { menuItem, quantity, item_note: note }];
    });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.menuItem.id !== menuItemId)
    );
  };

  const updateItemNote = (menuItemId: string, note: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, item_note: note } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setOrderNote('');
  };

  const getItemQuantity = (menuItemId: string) => {
    const found = cart.find((item) => item.menuItem.id === menuItemId);
    return found ? found.quantity : 0;
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalAmount = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        tableId,
        tableNumber,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        orderNote,
        setOrderNote,
        setTableInfo,
        addToCart,
        updateQuantity,
        removeFromCart,
        updateItemNote,
        clearCart,
        getItemQuantity,
        totalItemsCount,
        subtotalAmount,
        recentOrderIds,
        addRecentOrderId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
