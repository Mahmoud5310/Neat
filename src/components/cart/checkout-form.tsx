import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { PATHS, PAYMENT_METHODS } from '@/lib/constants';
import { loadPayPalScript, createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';

const checkoutFormSchema = z.object({
  paymentMethod: z.string().min(1, "Payment method is required"),
  phoneNumber: z.string().min(1, "Phone number is required").optional(),
  transactionId: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutForm() {
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();
  const { cart, coupon, getTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // PayPal specific states
  const [paypalReady, setPaypalReady] = useState(false);
  const [isProcessingPaypal, setIsProcessingPaypal] = useState(false);
  const paypalButtonsContainerRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      paymentMethod: PAYMENT_METHODS[0].id,
      phoneNumber: "",
      transactionId: "",
    },
  });
  
  // Define order mutation
  const orderMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/orders", data);
      return await res.json();
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/orders"] });

      toast({
        title: t('checkout.paymentSuccess'),
        description: t('checkout.downloadInstructions'),
      });

      // Clear cart and redirect to download page
      clearCart();
      setLocation(`/download/${order.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  });

  // Get current payment method from form
  const selectedPaymentMethod = form.watch('paymentMethod');
  
  // Setup PayPal when page loads or payment method changes
  useEffect(() => {
    if (selectedPaymentMethod === 'paypal' && paypalButtonsContainerRef.current) {
      const initPayPal = async () => {
        try {
          setPaypalReady(false);
          // Load PayPal script
          const paypalInstance = await loadPayPalScript();
          
          if (paypalInstance && paypalButtonsContainerRef.current) {
            // Clear previous elements in button container
            paypalButtonsContainerRef.current.innerHTML = '';
            
            // Check if Buttons function exists
            if (typeof paypalInstance.Buttons === 'function') {
              // Create PayPal buttons
              const buttons = paypalInstance.Buttons({
                style: {
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'pay'
                },
                
                // Function called when PayPal button is clicked
                createOrder: async () => {
                  setIsProcessingPaypal(true);
                  
                  try {
                    // Calculate total amount
                    const total = getTotal();
                    
                    // Create PayPal order from server
                    const order = await createPayPalOrder(total);
                    return order.id;
                  } catch (error) {
                    console.error("Error creating PayPal order:", error);
                    toast({
                      title: t('common.error'),
                      description: t('checkout.orderProcessingFailed'),
                      variant: "destructive",
                    });
                    setIsProcessingPaypal(false);
                    return "";
                  }
                },
                
                // Function called when payment is approved
                onApprove: async (data: any) => {
                  try {
                    // Complete payment
                    const captureResult = await capturePayPalOrder(data.orderID);
                    
                    if (captureResult.status === "COMPLETED") {
                      // Store last order ID
                      let lastOrderId = null;
                      
                      // Process each item in cart
                      for (const item of cart) {
                        const order = await orderMutation.mutateAsync({
                          projectId: item.id,
                          price: item.price,
                          discountApplied: !!coupon,
                          finalPrice: coupon ? item.price * (1 - (coupon.discount / 100)) : item.price,
                          paymentMethod: "paypal",
                          paymentReference: data.orderID,
                          couponCode: coupon?.code || undefined
                        });
                        
                        if (order && order.id) {
                          lastOrderId = order.id;
                        }
                      }
                      
                      // Clear cart
                      clearCart();
                      
                      // Show success message
                      toast({
                        title: t('checkout.paymentSuccess'),
                        description: t('checkout.downloadReady'),
                      });
                      
                      // Navigate to download page
                      if (lastOrderId) {
                        setLocation(`/download/${lastOrderId}`);
                      } else {
                        setLocation(PATHS.HOME);
                      }
                    } else {
                      throw new Error("PayPal payment not completed");
                    }
                  } catch (error) {
                    console.error("Error capturing PayPal payment:", error);
                    toast({
                      title: t('common.error'),
                      description: t('checkout.orderProcessingFailed'),
                      variant: "destructive",
                    });
                  } finally {
                    setIsProcessingPaypal(false);
                  }
                },
                
                // Function called when user cancels
                onCancel: () => {
                  toast({
                    title: t('common.cancelled'),
                    description: t('checkout.paymentCancelled'),
                  });
                  setIsProcessingPaypal(false);
                },
                
                // Function called on error
                onError: (err: any) => {
                  console.error("PayPal Error:", err);
                  toast({
                    title: t('common.error'),
                    description: t('checkout.paymentError'),
                    variant: "destructive",
                  });
                  setIsProcessingPaypal(false);
                }
              });
              
              if (buttons.render) {
                buttons.render(paypalButtonsContainerRef.current);
                setPaypalReady(true);
              }
            } else {
              console.error("PayPal Buttons function not available");
              toast({
                title: t('common.error') || "خدمة غير متاحة",
                description: "خدمة PayPal غير متاحة حالياً. يرجى استخدام فودافون كاش للدفع",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Failed to load PayPal:", error);
          toast({
            title: t('common.error') || "خدمة غير متاحة",
            description: "خدمة PayPal غير متاحة حالياً. يرجى استخدام فودافون كاش كطريقة بديلة للدفع",
            variant: "destructive",
          });
        }
      };
      
      initPayPal();
    }
  }, [selectedPaymentMethod, cart, coupon, t, toast, getTotal, clearCart, setLocation, orderMutation]);

  const onSubmit = async (data: CheckoutFormValues) => {
    // If payment method is PayPal, don't do anything on form submit
    // as payment will be processed via PayPal buttons
    if (data.paymentMethod === 'paypal') {
      toast({
        title: "خدمة غير متاحة",
        description: "خدمة PayPal غير متاحة حالياً. يرجى استخدام فودافون كاش كطريقة بديلة للدفع",
        variant: "destructive",
      });
      return;
    }
    
    // Activate processing state
    setIsProcessing(true);

    // Show loading message to user
    toast({
      title: t('checkout.processing'),
      description: t('checkout.verifyingOrder'),
    });

    // Add delay for processing effect (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      // Store last order ID for redirection
      let lastOrderId = null;
      
      // Process each item in cart
      for (const item of cart) {
        const order = await orderMutation.mutateAsync({
          projectId: item.id,
          price: item.price,
          discountApplied: !!coupon,
          finalPrice: coupon ? item.price * (1 - (coupon.discount / 100)) : item.price,
          paymentMethod: data.paymentMethod,
          paymentReference: data.transactionId || undefined,
          couponCode: coupon?.code || undefined
        });
        
        // Store last order ID
        if (order && order.id) {
          lastOrderId = order.id;
        }
      }
      
      // Clear cart
      clearCart();
      
      // Show success message
      toast({
        title: t('checkout.paymentSuccess'),
        description: t('checkout.downloadReady'),
      });
      
      // Immediate redirect to download page with last order ID
      if (lastOrderId) {
        // Navigate directly to download page
        setLocation(`/download/${lastOrderId}`);
      } else {
        // If no order ID, redirect to home page
        setLocation(PATHS.HOME);
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('checkout.orderProcessingFailed'),
        variant: 'destructive'
      });
      console.error("Order processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Show or hide fields based on selected payment method
  const showVodafoneFields = selectedPaymentMethod === 'vodafone_cash';
  const showPayPalContainer = selectedPaymentMethod === 'paypal';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment Method */}
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t('checkout.paymentMethod')}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <FormItem
                      key={method.id}
                      className="flex items-center space-x-3 rtl:space-x-reverse space-y-0 border p-4 rounded-md"
                    >
                      <FormControl>
                        <RadioGroupItem value={method.id} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center">
                        <i className={`fas ${method.icon} mr-2 rtl:ml-2 rtl:mr-0 text-primary`}></i>
                        <span>{method.id === 'vodafone_cash' ? t('checkout.vodafoneCash') : method.name}</span>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PayPal Container */}
        {showPayPalContainer && (
          <div className="mt-4">
            <div ref={paypalButtonsContainerRef} className="paypal-buttons-container">
              {!paypalReady && <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ms-2">{t('checkout.loadingPayment') || "Loading payment options..."}</span>
              </div>}
            </div>
            <div className="text-sm text-muted-foreground mt-2 text-center">
              {t('checkout.securePayment') || "Secure payment processing"}
            </div>
          </div>
        )}

        {/* Vodafone Cash Fields */}
        {showVodafoneFields && (
          <>
            {/* Payment Instructions */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <h3 className="font-medium mb-2">{t('checkout.instructions')}</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('checkout.vodafoneInstructions')}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {t('checkout.contactNumber')}: 01026795965
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('checkout.downloadNote')}
                </p>
              </div>
            </div>

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('checkout.phoneNumber')}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="01XXXXXXXXX" 
                      type="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction ID */}
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('checkout.transactionId')}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="VC123456789" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark" 
              disabled={isProcessing || orderMutation.isPending}
            >
              {(isProcessing || orderMutation.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.processing')}
                </>
              ) : (
                t('checkout.placeOrder')
              )}
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}