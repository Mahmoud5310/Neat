import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Redirect } from "wouter";
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
  Download
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
import { Label } from "@/components/ui/label";
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

// This would normally come from your API
const salesData = [
  { date: "Jan", revenue: 4500, orders: 25 },
  { date: "Feb", revenue: 5300, orders: 30 },
  { date: "Mar", revenue: 6800, orders: 42 },
  { date: "Apr", revenue: 6200, orders: 38 },
  { date: "May", revenue: 7100, orders: 45 },
  { date: "Jun", revenue: 8200, orders: 50 },
  { date: "Jul", revenue: 9000, orders: 55 },
  { date: "Aug", revenue: 8400, orders: 52 },
  { date: "Sep", revenue: 9100, orders: 58 },
  { date: "Oct", revenue: 10500, orders: 64 },
  { date: "Nov", revenue: 11200, orders: 68 },
  { date: "Dec", revenue: 12000, orders: 72 },
];

const categoryData = [
  { name: "Web Development", value: 42 },
  { name: "Mobile Apps", value: 28 },
  { name: "UI/UX Design", value: 15 },
  { name: "AI/ML", value: 10 },
  { name: "Blockchain", value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const topSellingProjects = [
  { 
    id: 1, 
    title: "E-commerce Platform", 
    category: "Web Development",
    sales: 152,
    revenue: 45588.48,
    growth: 12.5
  },
  { 
    id: 2, 
    title: "Mobile Fitness App", 
    category: "Mobile Development",
    sales: 210,
    revenue: 31497.90,
    growth: 24.8
  },
  { 
    id: 3, 
    title: "AI Image Generator", 
    category: "AI/ML",
    sales: 64,
    revenue: 31999.36,
    growth: 8.2
  },
  { 
    id: 4, 
    title: "Social Media Dashboard", 
    category: "UI/UX Design",
    sales: 87,
    revenue: 17399.13,
    growth: -3.6
  },
  { 
    id: 5, 
    title: "Blockchain Wallet", 
    category: "Blockchain",
    sales: 42,
    revenue: 25199.58,
    growth: 15.3
  },
];

const recentTransactions = [
  {
    id: "T12345",
    user: { name: "John Smith", email: "john@example.com", avatar: "" },
    amount: 299.99,
    project: "E-commerce Platform",
    date: "2023-03-22T10:30:00Z",
    status: "completed"
  },
  {
    id: "T12346",
    user: { name: "Sarah Johnson", email: "sarah@example.com", avatar: "" },
    amount: 499.99,
    project: "AI Image Generator",
    date: "2023-03-22T09:15:00Z",
    status: "completed"
  },
  {
    id: "T12347",
    user: { name: "Mike Williams", email: "mike@example.com", avatar: "" },
    amount: 199.99,
    project: "Social Media Dashboard",
    date: "2023-03-21T16:45:00Z",
    status: "completed"
  },
  {
    id: "T12348",
    user: { name: "Emily Davis", email: "emily@example.com", avatar: "" },
    amount: 149.99,
    project: "Mobile Fitness App",
    date: "2023-03-21T14:20:00Z",
    status: "refunded"
  },
  {
    id: "T12349",
    user: { name: "David Brown", email: "david@example.com", avatar: "" },
    amount: 599.99,
    project: "Blockchain Wallet",
    date: "2023-03-21T11:05:00Z",
    status: "pending"
  },
];

export default function AdminAnalytics() {
  const { user, logoutMutation } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeframe, setTimeframe] = useState("yearly");
  const isRTL = currentLanguage === "ar";

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
    return new Intl.NumberFormat(currentLanguage === "ar" ? "ar-SA" : "en-US", {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === "ar" ? "ar-SA" : "en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <Button
              key={index}
              variant="ghost"
              className={`justify-start my-1 ${sidebarCollapsed ? "mx-auto px-0 w-12" : "mx-2"} ${item.path === '/admin/analytics' ? 'bg-primary/10' : ''}`}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <span className="ms-3">{item.label}</span>
              )}
            </Button>
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
                <p className="text-sm font-medium">{user.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Analytics Page Content */}
        <main className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{t("analytics_dashboard")}</h1>
              <p className="text-muted-foreground">{t("analytics_description")}</p>
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
                  <SelectItem value="weekly">{t("weekly")}</SelectItem>
                  <SelectItem value="monthly">{t("monthly")}</SelectItem>
                  <SelectItem value="quarterly">{t("quarterly")}</SelectItem>
                  <SelectItem value="yearly">{t("yearly")}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {t("export_data")}
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
                <div className="text-2xl font-bold">{formatCurrency(148700)}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +20.1% {t("from_previous_period")}
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
                <div className="text-2xl font-bold">599</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.4% {t("from_previous_period")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("avg_order_value")}
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(248.25)}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +6.8% {t("from_previous_period")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("active_customers")}
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,310</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-red-500">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -3.2% {t("from_previous_period")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("revenue_and_sales_trend")}</CardTitle>
                <CardDescription>
                  {t("revenue_trend_description")}
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
                <CardTitle>{t("sales_by_category")}</CardTitle>
                <CardDescription>
                  {t("sales_category_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Projects & Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("top_selling_projects")}</CardTitle>
                <CardDescription>
                  {t("top_projects_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("project")}</TableHead>
                      <TableHead className="text-right">{t("sales")}</TableHead>
                      <TableHead className="text-right">{t("revenue")}</TableHead>
                      <TableHead className="text-right">{t("growth")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellingProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium">{project.title}</p>
                            <p className="text-xs text-muted-foreground">{project.category}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{project.sales}</TableCell>
                        <TableCell className="text-right">{formatCurrency(project.revenue)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`flex items-center justify-end ${project.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {project.growth >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                            {project.growth}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  {t("view_all_projects")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("recent_transactions")}</CardTitle>
                <CardDescription>
                  {t("recent_transactions_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{transaction.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{transaction.user.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(transaction.amount)}</p>
                        <Badge variant={
                          transaction.status === "completed" ? "outline" : 
                          transaction.status === "refunded" ? "destructive" : "secondary"
                        } className="mt-1">
                          {t(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  {t("view_all_transactions")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}