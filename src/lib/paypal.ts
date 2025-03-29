import { loadScript } from "@paypal/paypal-js";
import { apiRequest } from "./queryClient";

// أنواع للبيانات المُعادة من PayPal
export interface PayPalOrder {
  id: string;
  status: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
}

export interface PayPalCaptureResult {
  id: string;
  status: string;
  purchase_units: any[];
  payer: any;
}

// تحميل سكريبت PayPal SDK
export async function loadPayPalScript() {
  return loadScript({
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID as string,
    currency: "USD",
    intent: "capture"
  });
}

// إنشاء طلب دفع جديد من الخادم
export async function createPayPalOrder(amount: number): Promise<PayPalOrder> {
  const response = await apiRequest('POST', '/api/paypal/create-order', { amount });
  return await response.json();
}

// إكمال عملية الدفع بعد موافقة المستخدم
export async function capturePayPalOrder(orderId: string): Promise<PayPalCaptureResult> {
  const response = await apiRequest('POST', '/api/paypal/capture-order', { orderId });
  return await response.json();
}

// الحصول على معلومات الطلب
export async function getPayPalOrder(orderId: string): Promise<PayPalOrder> {
  const response = await apiRequest('GET', `/api/paypal/order/${orderId}`);
  return await response.json();
}