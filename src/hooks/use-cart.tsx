
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/context/cart-context';
import { Project } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';

export function useCart() {
  const { cart, addToCart, removeFromCart, clearCart, updateQuantity, applyCoupon, coupon } = useContext(CartContext);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const addItem = (project: Project) => {
    const existingItem = cart.find(item => item.id === project.id);
    
    if (existingItem) {
      toast({
        title: t('cart.alreadyInCart'),
        description: t('cart.itemAlreadyExists'),
        variant: "destructive"
      });
      return;
    }

    addToCart(project);
    toast({
      title: t('cart.addedToCart'),
      description: t('cart.itemAddedToCart'),
    });
  };

  const removeItem = (projectId: number) => {
    removeFromCart(projectId);
    toast({
      title: t('cart.removed'),
      description: t('cart.itemRemoved'),
    });
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    return getSubtotal() * (coupon.discount / 100);
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount();
  };

  const isEmpty = cart.length === 0;

  return {
    cart,
    coupon,
    addItem,
    removeItem,
    clearCart,
    updateQuantity,
    applyCoupon,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    isEmpty,
    isProcessing,
    setIsProcessing
  };
}
