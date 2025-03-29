import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { PATHS } from '@/lib/constants';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CheckoutForm from '@/components/cart/checkout-form';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { cart, coupon, getSubtotal, getDiscountAmount, getTotal, isEmpty } = useCart();
  const [, setLocation] = useLocation();
  
  // Fetch projects to get details
  const { data: projects = [], isLoading } = useQuery<Project[]>({ 
    queryKey: ['/api/projects'],
  });
  
  // Redirect if cart is empty
  useEffect(() => {
    if (isEmpty) {
      setLocation(PATHS.CART);
    }
  }, [isEmpty, setLocation]);
  
  // Get a project by ID
  const getProjectById = (projectId: number) => {
    return projects.find(project => project.id === projectId);
  };
  
  // If cart is empty, don't render the page
  if (isEmpty) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('checkout.title')}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side: Order summary */}
        <div className="lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>{t('checkout.orderSummary')}</CardTitle>
              <CardDescription>{t('checkout.reviewItems')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const project = getProjectById(item.id) || item;
                    return (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <img 
                            src={project.imageUrl} 
                            alt={language === 'ar' ? project.titleAr : project.title} 
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">
                              {language === 'ar' ? project.titleAr : project.title}
                            </h3>
                            {item.technologies && (
                              <div className="text-sm text-gray-500">
                                {item.technologies.slice(0, 2).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="font-bold">
                          {language === 'ar' ? `${item.price}$` : `$${item.price}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
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
                    <span>
                      {t('cart.discount')} ({coupon.discount}%)
                    </span>
                    <span>
                      - {language === 'ar' 
                        ? `${getDiscountAmount().toFixed(2)}$` 
                        : `$${getDiscountAmount().toFixed(2)}`}
                    </span>
                  </div>
                )}
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('cart.total')}</span>
                  <span>
                    {language === 'ar' 
                      ? `${getTotal().toFixed(2)}$` 
                      : `$${getTotal().toFixed(2)}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side: Payment form */}
        <div className="lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>{t('checkout.paymentDetails')}</CardTitle>
              <CardDescription>{t('checkout.securePayment')}</CardDescription>
            </CardHeader>
            <CardContent>
              <CheckoutForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
