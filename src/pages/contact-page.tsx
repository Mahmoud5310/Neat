import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { PATHS } from '@/lib/constants';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon, 
  ClockIcon,
  LoaderCircleIcon
} from 'lucide-react';

// نموذج الاتصال
const contactFormSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون على الأقل حرفين"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  subject: z.string().min(5, "الموضوع يجب أن يكون على الأقل 5 أحرف"),
  message: z.string().min(10, "الرسالة يجب أن تكون على الأقل 10 أحرف")
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isRtl = language === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // معلومات الاتصال
  const contactInfo = [
    {
      title: isRtl ? 'البريد الإلكتروني' : 'Email',
      details: 'support@neat.com',
      icon: <MailIcon className="h-6 w-6 text-primary" />
    },
    {
      title: isRtl ? 'الهاتف' : 'Phone',
      details: '+20 123 456 7890',
      icon: <PhoneIcon className="h-6 w-6 text-primary" />
    },
    {
      title: isRtl ? 'العنوان' : 'Address',
      details: isRtl ? 'القاهرة، مصر، 12345' : 'Cairo, Egypt, 12345',
      icon: <MapPinIcon className="h-6 w-6 text-primary" />
    },
    {
      title: isRtl ? 'ساعات العمل' : 'Working Hours',
      details: isRtl ? 'من الأحد إلى الخميس، 9 صباحًا - 5 مساءً' : 'Sunday - Thursday, 9AM - 5PM',
      icon: <ClockIcon className="h-6 w-6 text-primary" />
    }
  ];
  
  // التعامل مع النموذج
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });
  
  // تقديم النموذج
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // محاكاة تقديم النموذج
    try {
      // في تطبيق حقيقي، هنا سنرسل البيانات إلى الخادم
      console.log("Form data:", data);
      
      // نتوقف لثانيتين لمحاكاة الاتصال بالخادم
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // إظهار رسالة نجاح
      toast({
        title: isRtl ? "تم إرسال رسالتك" : "Message Sent",
        description: isRtl ? "سنتواصل معك قريبًا" : "We'll get back to you soon",
        variant: "default"
      });
      
      // إعادة تعيين النموذج
      form.reset();
    } catch (error) {
      // إظهار رسالة خطأ
      toast({
        title: isRtl ? "حدث خطأ" : "Error",
        description: isRtl ? "فشل إرسال رسالتك، يرجى المحاولة مرة أخرى" : "Failed to send your message, please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <section className="py-16 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {isRtl ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            {isRtl 
              ? 'نحن هنا للإجابة على جميع استفساراتك ومساعدتك في اختيار المشروع المناسب لاحتياجاتك.'
              : 'We are here to answer all your questions and help you choose the right project for your needs.'}
          </p>
        </div>
      </section>
      
      {/* Contact Form and Information */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8">
              
              {/* Contact Form */}
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRtl ? 'أرسل لنا رسالة' : 'Send Us a Message'}</CardTitle>
                    <CardDescription>
                      {isRtl 
                        ? 'املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.'
                        : 'Fill out the form below and we will get back to you as soon as possible.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{isRtl ? 'الاسم' : 'Name'}</FormLabel>
                              <FormControl>
                                <Input placeholder={isRtl ? "الاسم الكامل" : "Full Name"} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{isRtl ? 'البريد الإلكتروني' : 'Email'}</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{isRtl ? 'الموضوع' : 'Subject'}</FormLabel>
                              <FormControl>
                                <Input placeholder={isRtl ? "موضوع رسالتك" : "Your message subject"} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{isRtl ? 'الرسالة' : 'Message'}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={isRtl ? "اكتب رسالتك هنا..." : "Type your message here..."} 
                                  className="min-h-[120px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                              {isRtl ? 'جارٍ الإرسال...' : 'Sending...'}
                            </>
                          ) : (
                            isRtl ? 'إرسال الرسالة' : 'Send Message'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              {/* Contact Information */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRtl ? 'معلومات الاتصال' : 'Contact Information'}</CardTitle>
                    <CardDescription>
                      {isRtl 
                        ? 'يمكنك الوصول إلينا من خلال:'
                        : 'You can reach us through:'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {contactInfo.map((info, index) => (
                        <div key={index} className="flex items-start">
                          <div className="mt-1 mr-3 rtl:ml-3 rtl:mr-0">
                            {info.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{info.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">{info.details}</p>
                          </div>
                        </div>
                      ))}
                      
                      <Separator className="my-6" />
                      
                      {/* Social Media Links */}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                          {isRtl ? 'تابعنا على' : 'Follow Us On'}
                        </h3>
                        <div className="flex space-x-4 rtl:space-x-reverse">
                          <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                            <i className="fab fa-facebook-f text-xl"></i>
                          </a>
                          <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                            <i className="fab fa-twitter text-xl"></i>
                          </a>
                          <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                            <i className="fab fa-instagram text-xl"></i>
                          </a>
                          <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                            <i className="fab fa-linkedin-in text-xl"></i>
                          </a>
                          <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                            <i className="fab fa-github text-xl"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* FAQ Link Card */}
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold mb-2">
                        {isRtl ? 'لديك أسئلة؟' : 'Have Questions?'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {isRtl 
                          ? 'قد تجد إجابات لأسئلتك الشائعة في صفحة الأسئلة المتكررة لدينا.'
                          : 'You might find answers to your common questions in our FAQ page.'}
                      </p>
                      <Button variant="outline" asChild>
                        <Link href={PATHS.FAQ}>
                          {isRtl ? 'زيارة الأسئلة المتكررة' : 'Visit FAQ'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {isRtl ? 'موقعنا' : 'Our Location'}
            </h2>
            <Separator className="mx-auto w-24 my-4 bg-primary" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {isRtl 
                ? 'يمكنك زيارتنا في مكتبنا خلال ساعات العمل:'
                : 'You can visit us at our office during working hours:'}
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-video relative">
              {/* في تطبيق حقيقي، سنستبدل هذا بخريطة جوجل تفاعلية */}
              <img 
                src="https://maps.googleapis.com/maps/api/staticmap?center=Cairo,Egypt&zoom=12&size=800x400&key=YOUR_API_KEY" 
                alt="Our Location" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center">
                  <h3 className="font-bold text-lg mb-1">{isRtl ? 'مكتب Neat' : 'Neat Office'}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isRtl ? 'القاهرة، مصر، 12345' : 'Cairo, Egypt, 12345'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}