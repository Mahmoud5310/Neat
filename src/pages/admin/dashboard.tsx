import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Redirect, Link } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Tag, 
  Star, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu,
  Bell,
  Moon,
  Sun,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  DollarSign,
  ShoppingCart,
  UserCheck,
  Download,
  Package,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Sample data
const salesData = [
  { date: "Mar 15", revenue: 1200, orders: 18 },
  { date: "Mar 16", revenue: 1800, orders: 25 },
  { date: "Mar 17", revenue: 1400, orders: 20 },
  { date: "Mar 18", revenue: 2200, orders: 30 },
  { date: "Mar 19", revenue: 1600, orders: 24 },
  { date: "Mar 20", revenue: 2400, orders: 34 },
  { date: "Mar 21", revenue: 2800, orders: 38 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Recent orders data
const recentOrders = [
  {
    id: "ORD-7352",
    customer: { name: "Ahmed Ali", email: "ahmed@example.com", avatar: "" },
    status: "completed",
    date: "2023-03-21T14:30:00Z",
    amount: 299.99,
    items: 1
  },
  {
    id: "ORD-7351",
    customer: { name: "Sarah Johnson", email: "sarah@example.com", avatar: "" },
    status: "processing",
    date: "2023-03-21T12:15:00Z",
    amount: 149.99,
    items: 2
  },
  {
    id: "ORD-7350",
    customer: { name: "Michael Brown", email: "michael@example.com", avatar: "" },
    status: "completed",
    date: "2023-03-20T18:45:00Z",
    amount: 499.99,
    items: 1
  },
  {
    id: "ORD-7349",
    customer: { name: "Emily Davis", email: "emily@example.com", avatar: "" },
    status: "shipped",
    date: "2023-03-20T10:30:00Z",
    amount: 199.99,
    items: 1
  },
  {
    id: "ORD-7348",
    customer: { name: "David Wilson", email: "david@example.com", avatar: "" },
    status: "refunded",
    date: "2023-03-19T16:20:00Z",
    amount: 349.99,
    items: 3
  },
];

// Recent activities data
const recentActivities = [
  {
    id: 1,
    type: "new_user",
    content: "New user registered: Lina Ahmed",
    timestamp: "2023-03-21T15:30:00Z"
  },
  {
    id: 2,
    type: "new_order",
    content: "New order #ORD-7352 placed by Ahmed Ali",
    timestamp: "2023-03-21T14:30:00Z"
  },
  {
    id: 3,
    type: "new_review",
    content: "New 5-star review for 'E-commerce Platform' by Sarah Johnson",
    timestamp: "2023-03-21T12:45:00Z"
  },
  {
    id: 4,
    type: "refund",
    content: "Refund processed for order #ORD-7348 by David Wilson",
    timestamp: "2023-03-19T16:25:00Z"
  },
  {
    id: 5,
    type: "price_change",
    content: "Price updated for 'AI Image Generator' from $599.99 to $499.99",
    timestamp: "2023-03-19T11:10:00Z"
  },
  {
    id: 6,
    type: "system",
    content: "System update completed successfully",
    timestamp: "2023-03-18T09:00:00Z"
  },
  {
    id: 7,
    type: "new_message",
    content: "New support message from James Taylor",
    timestamp: "2023-03-18T08:15:00Z"
  },
];

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const { t, language } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeframe, setTimeframe] = useState("weekly");
  const isRTL = language === "ar";

  // Make sure only admins can access this page
  const isAdmin = user && (user.email === 'admin@neat.com' || user.email === 'admin@example.com');
  if (!isAdmin) {
    return <Redirect to="/auth" />;
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Sidebar animation variants
  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 80 },
  };

  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: t("dashboard"), path: "/admin" },
    { icon: <Users className="h-5 w-5" />, label: t("users"), path: "/admin/users" },
    { icon: <ShoppingBag className="h-5 w-5" />, label: t("projects"), path: "/admin/projects" },
    { icon: <BarChart3 className="h-5 w-5" />, label: t("analytics"), path: "/admin/analytics" },
    { icon: <Tag className="h-5 w-5" />, label: t("coupons"), path: "/admin/coupons" },
    { icon: <Star className="h-5 w-5" />, label: t("reviews"), path: "/admin/reviews" },
    { icon: <Settings className="h-5 w-5" />, label: t("settings"), path: "/admin/settings" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US", {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(language === "ar" ? "ar-SA" : "en-US", {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_user':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'new_order':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'new_review':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'refund':
        return <DollarSign className="h-4 w-4 text-red-500" />;
      case 'price_change':
        return <Tag className="h-4 w-4 text-purple-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />;
      case 'new_message':
        return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">{t("completed")}</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">{t("processing")}</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">{t("shipped")}</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">{t("refunded")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className={`flex min-h-screen bg-background ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <motion.div 
        className={`fixed top-0 bottom-0 left-0 z-20 flex flex-col bg-card border-r`}
        variants={sidebarVariants}
        initial={sidebarCollapsed ? "collapsed" : "expanded"}
        animate={sidebarCollapsed ? "collapsed" : "expanded"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between p-4 h-16">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-xl text-primary"
            >
              Neat Admin
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronLeft className={`h-5 w-5 transform transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>
        
        <div className="flex flex-col flex-grow pt-5">
          {menuItems.map((item, index) => (
            <Link href={item.path} key={index}>
              <Button
                variant="ghost"
                className={`justify-start my-1 ${sidebarCollapsed ? "mx-auto px-0 w-12" : "mx-2"} ${item.path === '/admin' ? 'bg-primary/10' : ''}`}
              >
                {item.icon}
                {!sidebarCollapsed && (
                  <span className="ms-3">{item.label}</span>
                )}
              </Button>
            </Link>
          ))}
        </div>
        
        <div className="p-4">
          <Button
            variant="ghost"
            className={`justify-start w-full ${sidebarCollapsed ? "px-0" : ""}`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && (
              <span className="ms-3">{t("logout")}</span>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      <div 
        className={`flex-grow ${sidebarCollapsed ? "ms-20" : "ms-64"} transition-all duration-300`}
      >
        {/* Header */}
        <header className="h-16 flex items-center justify-between border-b px-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center ml-auto gap-4">
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <Separator orientation="vertical" className="h-8" />
            
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
              <p className="text-muted-foreground">{t("welcome_to_admin", { date: new Date().toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) })}</p>
            </div>
            
            <div className="flex gap-3 mt-3 md:mt-0">
              <Select 
                value={timeframe} 
                onValueChange={setTimeframe}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t("select_timeframe")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">{t("today")}</SelectItem>
                  <SelectItem value="weekly">{t("weekly")}</SelectItem>
                  <SelectItem value="monthly">{t("monthly")}</SelectItem>
                  <SelectItem value="yearly">{t("yearly")}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {t("export")}
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("total_revenue")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(28750)}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +16.3% {t("from_previous_period")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("new_customers")}
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+189</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +32.1% {t("from_previous_period")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("total_orders")}
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">259</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.2% {t("from_previous_period")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("total_products")}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5% {t("from_previous_period")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>{t("revenue_overview")}</CardTitle>
                <CardDescription>
                  {t("revenue_overview_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "revenue") {
                            return [`${formatCurrency(value as number)}`, t("revenue")];
                          }
                          return [`${value}`, t("orders")];
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("recent_activity")}</CardTitle>
                <CardDescription>
                  {t("recent_activity_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-auto pr-2">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="mt-0.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">{activity.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.timestamp)}, {formatTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>{t("recent_orders")}</CardTitle>
              <CardDescription>
                {t("recent_orders_description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("order_id")}</TableHead>
                    <TableHead>{t("customer")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("items")}</TableHead>
                    <TableHead className="text-right">{t("amount")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{order.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Button variant="ghost" className="ms-auto">
                {t("view_all_orders")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}