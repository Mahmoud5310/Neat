import { createContext, ReactNode, useState, useEffect } from 'react';
import { Project } from '@shared/schema';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface CartItem extends Project {
  quantity?: number;
}

interface Coupon {
  code: string;
  discount: number;
}

interface CartContextType {
  cart: CartItem[];
  coupon: Coupon | null;
  addToCart: (item: Project) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  coupon: null,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateQuantity: () => {},
  applyCoupon: async () => false,
  removeCoupon: () => {},
});

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  // Initialize cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Initialize coupon from localStorage
  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    const savedCoupon = localStorage.getItem('coupon');
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });

  // Validate coupon mutation
  const validateCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/validate-coupon", { code });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return await res.json();
    }
  });

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Update localStorage when coupon changes
  useEffect(() => {
    if (coupon) {
      localStorage.setItem('coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('coupon');
    }
  }, [coupon]);

  const addToCart = (item: Project) => {
    setCart(prevCart => {
      // Check if item already exists
      if (prevCart.some(cartItem => cartItem.id === item.id)) {
        return prevCart;
      }
      // Add new item
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const result = await validateCouponMutation.mutateAsync(code);
      
      if (result.valid) {
        setCoupon({
          code,
          discount: result.discount || 0
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        coupon,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
