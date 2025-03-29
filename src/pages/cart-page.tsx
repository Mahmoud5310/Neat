import { useState } from 'react';
import { Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { PATHS } from '@/lib/constants';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CartItem from '@/components/cart/cart-item';
import { Loader2, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { t, language } = useLanguage();
  const { cart, coupon, applyCoupon, removeCoupon, getSubtotal, getDiscountAmount, getTotal, isEmpty } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  
  // Validate coupon mutation
  const couponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/validate-coupon", { code });
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.valid) {
        applyCoupon(couponCode);
        toast({
          title: t('cart.couponApplied'),
          description: t('cart.discountApplied', { discount: data.discount }),
        });
        setCouponCode('');
      } else {
        toast({
          title: t('cart.invalidCoupon'),
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: t('cart.invalidCoupon'),
        description: t('cart.enterCoupon'),
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: t('cart.loginRequired'),
        description: t('cart.loginToApplyCoupon'),
        variant: "destructive",
      });
      return;
    }
    
    await couponMutation.mutateAsync(couponCode);
  };
  
  // Handle coupon removal
  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({
      title: t('cart.couponRemoved'),
      description: t('cart.discountRemoved'),
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('cart.title')}</h1>
      
      {isEmpty ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-lg mx-auto">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">{t('cart.empty')}</h2>
          <p className="text-gray-500 mb-6">{t('cart.emptyMessage')}</p>
          <Link href={PATHS.PRODUCTS}>
            <Button className="bg-primary hover:bg-primary-dark">
              {t('cart.startShopping')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side: Cart items */}
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>{t('cart.items')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </CardContent>
              <CardFooter className="flex justify-between p-4 border-t">
                <Link href={PATHS.PRODUCTS}>
                  <Button variant="ghost">
                    <i className="fas fa-arrow-left mr-2"></i>
                    {t('cart.continueShopping')}
                  </Button>
                </Link>
                <div className="text-sm text-muted-foreground">
                  {cart.length} {cart.length === 1 ? t('cart.item') : t('cart.items')}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right side: Order summary */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>{t('cart.summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span>
                    {language === 'ar' 
                      ? `${getSubtotal().toFixed(2)}$` 
                      : `$${getSubtotal().toFixed(2)}`}
                  </span>
                </div>
                
                {coupon && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center">
                      {t('cart.discount')} 
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-1 ml-1 text-red-500" 
                        onClick={handleRemoveCoupon}
                      >
                        <i className="fas fa-times text-xs"></i>
                      </Button>
                    </span>
                    <span>
                      - {language === 'ar' 
                        ? `${getDiscountAmount().toFixed(2)}$` 
                        : `$${getDiscountAmount().toFixed(2)}`}
                    </span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('cart.total')}</span>
                  <span>
                    {language === 'ar' 
                      ? `${getTotal().toFixed(2)}$` 
                      : `$${getTotal().toFixed(2)}`}
                  </span>
                </div>
                
                {/* Coupon */}
                <div className="pt-4">
                  <label className="block text-sm font-medium mb-2">
                    {t('cart.coupon')}
                  </label>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Input 
                      placeholder={t('cart.enterCouponPlaceholder')}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!coupon || couponMutation.isPending}
                    />
                    <Button 
                      onClick={handleApplyCoupon} 
                      disabled={!!coupon || couponMutation.isPending}
                    >
                      {couponMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        user ? t('cart.applyCoupon') : t('cart.loginToApplyCoupon')
                      )}
                    </Button>
                    {couponMutation.isError && (
                      <p className="text-sm text-red-500 mt-2">
                        {couponMutation.error?.message || t('cart.couponError')}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Continue to checkout */}
                <Button 
                  className="w-full bg-primary hover:bg-primary-dark mt-6"
                  asChild
                >
                  <Link href={user ? PATHS.CHECKOUT : PATHS.AUTH}>
                    {user ? t('cart.checkout') : t('cart.loginToCheckout')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
