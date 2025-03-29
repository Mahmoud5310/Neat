import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Order, Project } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { PATHS } from '@/lib/constants';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download } from 'lucide-react';

// Profile form schema
const profileFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().optional(),
});

// Password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function AccountPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [tab, setTab] = useState('purchases');
  
  // Fetch user orders
  const { 
    data: orders = [], 
    isLoading: isLoadingOrders 
  } = useQuery<Order[]>({ 
    queryKey: ['/api/user/orders'],
  });
  
  // Fetch projects to get details for orders
  const { 
    data: projects = [], 
    isLoading: isLoadingProjects 
  } = useQuery<Project[]>({ 
    queryKey: ['/api/projects'],
  });
  
  // Setup profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.displayName?.split(' ')[0] || "",
      email: user?.email || "",
      fullName: user?.displayName || "",
    },
  });
  
  // Setup password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Handle profile form submission
  const onProfileSubmit = (data: ProfileFormValues) => {
    // In a real app, you would submit the updated profile data to the server
    console.log("Profile update:", data);
  };
  
  // Handle password form submission
  const onPasswordSubmit = (data: PasswordFormValues) => {
    // In a real app, you would submit the password change to the server
    console.log("Password change:", data);
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  
  // Get a project by ID
  const getProjectById = (projectId: number) => {
    return projects.find(project => project.id === projectId);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Handle download
  const handleDownload = (order: Order) => {
    const project = getProjectById(order.projectId);
    if (project) {
      window.open(project.downloadUrl, '_blank');
    }
  };
  
  const isLoading = isLoadingOrders || isLoadingProjects;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('account.title')}</h1>
      
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">{t('account.manageYourAccount')}</h2>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={tab} onValueChange={setTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="purchases">{t('account.purchases')}</TabsTrigger>
              <TabsTrigger value="profile">{t('account.profile')}</TabsTrigger>
            </TabsList>
            
            {/* Purchases Tab */}
            <TabsContent value="purchases" className="mt-2">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('account.projectName')}</TableHead>
                        <TableHead>{t('account.orderDate')}</TableHead>
                        <TableHead>{t('account.orderTotal')}</TableHead>
                        <TableHead>{t('account.orderStatus')}</TableHead>
                        <TableHead>{t('account.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const project = getProjectById(order.projectId);
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {project ? (language === 'ar' ? project.titleAr : project.title) : `Project #${order.projectId}`}
                            </TableCell>
                            <TableCell>
                              {order.createdAt ? formatDate(order.createdAt.toString()) : '-'}
                            </TableCell>
                            <TableCell>
                              {language === 'ar' 
                                ? `${order.finalPrice}$` 
                                : `$${order.finalPrice}`}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(order.status)}>
                                {t(`account.status.${order.status}`) || order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleDownload(order)}
                                  className="flex items-center space-x-1"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  <span>{t('account.download')}</span>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  asChild
                                  className="flex items-center space-x-1"
                                >
                                  <Link href={PATHS.DOWNLOAD(order.projectId)}>
                                    <span>{t('account.downloadPage')}</span>
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <i className="fas fa-shopping-bag text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-medium mb-2">{t('account.noPurchases')}</h3>
                  <p className="text-gray-500 mb-4">{t('account.noPurchasesMessage')}</p>
                  <Button asChild>
                    <Link href={PATHS.PRODUCTS}>{t('account.browseProjects')}</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-2">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('account.personalInfo')}</CardTitle>
                    <CardDescription>{t('account.updatePersonalInfo')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('auth.usernameLabel')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('auth.emailLabel')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('auth.fullNameLabel')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="mt-2">
                          {t('account.updateProfile')}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                {/* Change Password */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('account.changePassword')}</CardTitle>
                    <CardDescription>{t('account.passwordRequirements')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('account.currentPassword')}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('account.newPassword')}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('account.confirmPassword')}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="mt-2">
                          {t('account.updatePassword')}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
