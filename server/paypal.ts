import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

// تهيئة بيئة PayPal (الإنتاج أو الاختبار)
function environment() {
  // إذا كان التطبيق في بيئة الإنتاج، استخدم بيئة الإنتاج، وإلا استخدم بيئة الاختبار (Sandbox)
  const clientId = process.env.PAYPAL_CLIENT_ID as string;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET as string;

  // للاختبار (Sandbox)، وهي البيئة الافتراضية
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

// إنشاء عميل PayPal
export function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

// دالة لإنشاء طلب دفع جديد
export async function createOrder(amount: number, currency: string = 'USD') {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  
  // تكوين تفاصيل الطلب
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toString()
      }
    }],
    application_context: {
      brand_name: 'Neat',
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: `${process.env.APP_URL || 'http://localhost:5000'}/checkout/success`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:5000'}/checkout/cancel`
    }
  });

  try {
    // إرسال الطلب إلى PayPal API
    const response = await client().execute(request);
    return response.result;
  } catch (err) {
    console.error("Error in creating PayPal order:", err);
    throw err;
  }
}

// دالة لإكمال أمر الدفع (Capture Order)
export async function captureOrder(orderId: string) {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.prefer("return=representation");

  try {
    // إرسال طلب إكمال الدفع إلى PayPal API
    const response = await client().execute(request);
    return response.result;
  } catch (err) {
    console.error("Error in capturing PayPal order:", err);
    throw err;
  }
}

// دالة للتحقق من حالة الطلب
export async function getOrder(orderId: string) {
  const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);

  try {
    // إرسال طلب للحصول على تفاصيل الطلب من PayPal API
    const response = await client().execute(request);
    return response.result;
  } catch (err) {
    console.error("Error in getting PayPal order details:", err);
    throw err;
  }
}