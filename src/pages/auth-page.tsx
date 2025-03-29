import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { PATHS } from '@/lib/constants';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

// نموذج تسجيل الدخول
const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

// نموذج التسجيل
const registerSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "يجب أن تكون كلمة المرور 6 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { 
    user, 
    loginWithEmailMutation, 
    loginWithGoogleMutation, 
    registerMutation 
  } = useAuth();
  const { t, language, isRtl } = useLanguage();

  // إعداد نموذج تسجيل الدخول
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // إعداد نموذج التسجيل
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // توجيه المستخدم إلى الصفحة الرئيسية إذا كان مسجل الدخول بالفعل
  useEffect(() => {
    if (user) {
      setLocation(PATHS.HOME);
    }
  }, [user, setLocation]);

  // معالجة تقديم نموذج تسجيل الدخول
  const onLoginSubmit = async (data: LoginFormValues) => {
    await loginWithEmailMutation.mutateAsync(data);
  };

  // معالجة تسجيل الدخول باستخدام جوجل
  const handleGoogleLogin = async () => {
    await loginWithGoogleMutation.mutateAsync();
  };

  // معالجة تقديم نموذج التسجيل
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    await registerMutation.mutateAsync(data);
  };

  // إذا كان المستخدم مصادق بالفعل، لا تعرض النموذج (لتجنب الوميض قبل إعادة التوجيه)
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-stretch gap-8 max-w-6xl mx-auto">
        {/* الجانب الأيسر: نماذج المصادقة */}
        <Card className="md:w-1/2 flex-grow">
          <CardHeader>
            <CardTitle>{t('auth.loginOrRegister')}</CardTitle>
            <CardDescription>{t('auth.secureLogin')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('common.login')}</TabsTrigger>
                <TabsTrigger value="register">{t('common.register')}</TabsTrigger>
              </TabsList>
              
              {/* نموذج تسجيل الدخول */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.emailLabel')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="example@domain.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.passwordLabel')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="********" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm text-right">
                      <a href="#" className="text-primary hover:underline">
                        {t('auth.forgotPassword')}
                      </a>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginWithEmailMutation.isPending}
                    >
                      {loginWithEmailMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          {t('auth.signIn')}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                        {t('auth.orContinueWith')}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleGoogleLogin}
                      disabled={loginWithGoogleMutation.isPending}
                    >
                      {loginWithGoogleMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FaGoogle className="mr-2 h-4 w-4" />
                      )}
                      {t('auth.google')}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* نموذج التسجيل */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.emailLabel')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="example@domain.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.passwordLabel')}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        t('auth.signUp')
                      )}
                    </Button>
                  </form>
                </Form>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                        {t('auth.orContinueWith')}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleGoogleLogin}
                      disabled={loginWithGoogleMutation.isPending}
                    >
                      {loginWithGoogleMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FaGoogle className="mr-2 h-4 w-4" />
                      )}
                      {t('auth.google')}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* الجانب الأيمن: قسم الترحيب */}
        <div className="md:w-1/2 flex-grow hero-gradient text-white rounded-lg p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-4">{t('auth.welcomeMessage')}</h2>
            <p className="mb-6">{t('auth.welcomeDescription')}</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-400 mt-1 mr-2 rtl:ml-2 rtl:mr-0"></i>
                <span>{t('auth.benefit1')}</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-400 mt-1 mr-2 rtl:ml-2 rtl:mr-0"></i>
                <span>{t('auth.benefit2')}</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-400 mt-1 mr-2 rtl:ml-2 rtl:mr-0"></i>
                <span>{t('auth.benefit3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
