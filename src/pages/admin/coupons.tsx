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
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Plus,
  Scissors,
  ClipboardCopy,
  CheckCircle,
  XCircle,
  CalendarRange
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// This would normally come from your API
const mockCoupons = [
  { 
    id: 1, 
    code: "WELCOME50", 
    type: "percentage",
    value: 50,
    minAmount: 100,
    maxUses: 1000,
    usesCount: 458,
    isActive: true,
    isLimited: true,
    expiresAt: "2025-04-30T23:59:59Z",
    createdAt: "2023-01-15T10:30:00Z",
    applicationRule: "once_per_customer",
    products: "all",
    categories: ["Web Development", "Mobile Development"],
  },
  { 
    id: 2, 
    code: "NEWYEAR25", 
    type: "percentage",
    value: 25,
    minAmount: 0,
    maxUses: 500,
    usesCount: 352,
    isActive: true,
    isLimited: true,
    expiresAt: "2025-01-31T23:59:59Z",
    createdAt: "2023-01-01T00:00:00Z",
    applicationRule: "unlimited",
    products: "all",
    categories: "all",
  },
  { 
    id: 3, 
    code: "FLASH30", 
    type: "percentage",
    value: 30,
    minAmount: 200,
    maxUses: 200,
    usesCount: 200,
    isActive: false,
    isLimited: true,
    expiresAt: "2023-06-15T23:59:59Z",
    createdAt: "2023-06-10T08:00:00Z",
    applicationRule: "once_per_customer",
    products: "specific",
    categories: ["UI/UX Design"],
  },
  { 
    id: 4, 
    code: "FLAT20", 
    type: "fixed",
    value: 20,
    minAmount: 100,
    maxUses: null,
    usesCount: 124,
    isActive: true,
    isLimited: false,
    expiresAt: null,
    createdAt: "2023-02-20T14:45:00Z",
    applicationRule: "unlimited",
    products: "all",
    categories: "all",
  },
  { 
    id: 5, 
    code: "SUMMER40", 
    type: "percentage",
    value: 40,
    minAmount: 150,
    maxUses: 800,
    usesCount: 612,
    isActive: true,
    isLimited: true,
    expiresAt: "2025-08-31T23:59:59Z",
    createdAt: "2023-06-01T10:00:00Z",
    applicationRule: "once_per_customer",
    products: "specific",
    categories: ["Mobile Development", "AI/ML"],
  },
];

const categories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "AI/ML",
  "Blockchain",
  "DevOps",
  "Data Science"
];

export default function AdminCoupons() {
  const { user, logoutMutation } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
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

  // Filter coupons based on search query and status filter
  const filteredCoupons = mockCoupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && coupon.isActive) || 
                         (statusFilter === "inactive" && !coupon.isActive) ||
                         (statusFilter === "expired" && new Date(coupon.expiresAt) < new Date());
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return t("never");
    
    return new Date(dateString).toLocaleDateString(currentLanguage === "ar" ? "ar-SA" : "en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: t("copied_to_clipboard"),
        description: t("coupon_code_copied", { code }),
      });
    });
  };

  // Function to calculate the progress of coupon usage
  const getUsageProgress = (coupon) => {
    if (!coupon.maxUses) return 0;
    return (coupon.usesCount / coupon.maxUses) * 100;
  };

  // Function to determine if a coupon is expired
  const isExpired = (coupon) => {
    if (!coupon.expiresAt) return false;
    return new Date(coupon.expiresAt) < new Date();
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
              className={`justify-start my-1 ${sidebarCollapsed ? "mx-auto px-0 w-12" : "mx-2"} ${item.path === '/admin/coupons' ? 'bg-primary/10' : ''}`}
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

        {/* Coupons Page Content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{t("coupon_management")}</h1>
            <p className="text-muted-foreground">{t("manage_coupons_description")}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("active_coupons")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCoupons.filter(c => c.isActive).length}</div>
                <p className="text-xs text-muted-foreground">
                  {mockCoupons.filter(c => c.isActive && !isExpired(c)).length} {t("non_expired")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("coupon_redemptions")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockCoupons.reduce((total, coupon) => total + coupon.usesCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("across_all_coupons")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("expiring_soon")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockCoupons.filter(c => c.isActive && c.expiresAt && new Date(c.expiresAt) > new Date() && 
                    new Date(c.expiresAt).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("expiring_in_30_days")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("search_coupons")} 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 items-center">
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t("filter_by_status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_coupons")}</SelectItem>
                  <SelectItem value="active">{t("active_coupons")}</SelectItem>
                  <SelectItem value="inactive">{t("inactive_coupons")}</SelectItem>
                  <SelectItem value="expired">{t("expired_coupons")}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("add_coupon")}
              </Button>
            </div>
          </div>

          {/* Coupons Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">{t("coupon_code")}</TableHead>
                    <TableHead>{t("discount")}</TableHead>
                    <TableHead>{t("usage")}</TableHead>
                    <TableHead>{t("applies_to")}</TableHead>
                    <TableHead>{t("expiry_date")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="font-mono bg-primary/10 text-primary px-2 py-1 rounded flex items-center">
                            {coupon.code}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 ml-1"
                              onClick={() => handleCopyCoupon(coupon.code)}
                            >
                              <ClipboardCopy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.type === "percentage" ? 
                          `${coupon.value}%` : 
                          `$${coupon.value.toFixed(2)}`
                        }
                        {coupon.minAmount > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {t("min_spend", { amount: `$${coupon.minAmount}` })}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">
                            {coupon.usesCount}/{coupon.maxUses || t("unlimited")}
                          </p>
                          {coupon.maxUses && (
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                              <div 
                                className={`h-full ${getUsageProgress(coupon) >= 90 ? 'bg-red-500' : 'bg-primary'}`} 
                                style={{ width: `${Math.min(getUsageProgress(coupon), 100)}%` }}
                              />
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {coupon.applicationRule === "once_per_customer" ? 
                              t("once_per_customer") : 
                              t("unlimited_uses_per_customer")
                            }
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.categories === "all" ? 
                          <Badge variant="outline">{t("all_categories")}</Badge> :
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(coupon.categories) && coupon.categories.map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        }
                      </TableCell>
                      <TableCell>
                        {coupon.expiresAt ? 
                          formatDate(coupon.expiresAt) : 
                          <Badge variant="outline">{t("never_expires")}</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        {isExpired(coupon) ? (
                          <Badge variant="secondary">{t("expired")}</Badge>
                        ) : coupon.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            {t("active")}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">{t("inactive")}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("coupon_actions")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditCoupon(coupon)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("edit_coupon")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyCoupon(coupon.code)}>
                              <Copy className="mr-2 h-4 w-4" />
                              {t("copy_code")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {coupon.isActive ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  {t("disable_coupon")}
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {t("enable_coupon")}
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteCoupon(coupon)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("delete_coupon")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add/Edit Coupon Dialog */}
      <Dialog 
        open={isEditDialogOpen || isAddDialogOpen} 
        onOpenChange={(open) => open ? null : (isEditDialogOpen ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false))}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCoupon ? t("edit_coupon") : t("add_new_coupon")}
            </DialogTitle>
            <DialogDescription>
              {selectedCoupon ? t("edit_coupon_description") : t("add_coupon_description")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code" className="font-medium">
                {t("coupon_code")}
              </Label>
              <div className="flex">
                <Input 
                  id="code" 
                  className="font-mono" 
                  defaultValue={selectedCoupon?.code || ""} 
                  placeholder="SUMMER50"
                />
                {!selectedCoupon && (
                  <Button variant="outline" className="ml-2" size="icon">
                    <Scissors className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{t("coupon_code_description")}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="discount-type" className="font-medium">{t("discount_type")}</Label>
                <Select defaultValue={selectedCoupon?.type || "percentage"}>
                  <SelectTrigger id="discount-type">
                    <SelectValue placeholder={t("select_discount_type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">{t("percentage")}</SelectItem>
                    <SelectItem value="fixed">{t("fixed_amount")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="discount-value" className="font-medium">{t("discount_value")}</Label>
                <Input 
                  id="discount-value" 
                  type="number" 
                  defaultValue={selectedCoupon?.value || ""} 
                  placeholder="50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="min-amount" className="font-medium">{t("minimum_spend")}</Label>
                <Input 
                  id="min-amount" 
                  type="number" 
                  defaultValue={selectedCoupon?.minAmount || "0"} 
                  placeholder="0"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="usage-limit" className="font-medium">{t("usage_limit")}</Label>
                <Input 
                  id="usage-limit" 
                  type="number" 
                  defaultValue={selectedCoupon?.maxUses || ""} 
                  placeholder={t("unlimited")}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="expiry-date" className="font-medium">{t("expiry_date")}</Label>
              <div className="flex">
                <Input 
                  id="expiry-date" 
                  type="date" 
                  defaultValue={selectedCoupon?.expiresAt ? new Date(selectedCoupon.expiresAt).toISOString().split('T')[0] : ""} 
                />
                <Button variant="outline" className="ml-2" size="icon">
                  <CalendarRange className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="applies-to" className="font-medium">{t("applies_to")}</Label>
              <Select defaultValue={selectedCoupon?.categories === "all" ? "all" : "specific"}>
                <SelectTrigger id="applies-to">
                  <SelectValue placeholder={t("select_categories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_categories")}</SelectItem>
                  <SelectItem value="specific">{t("specific_categories")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="customer-restriction" 
                defaultChecked={selectedCoupon?.applicationRule === "once_per_customer"}
              />
              <Label htmlFor="customer-restriction" className="text-sm">
                {t("one_use_per_customer")}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="coupon-active" 
                defaultChecked={selectedCoupon?.isActive || true}
              />
              <Label htmlFor="coupon-active" className="text-sm">
                {t("coupon_is_active")}
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => isEditDialogOpen ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">
              {selectedCoupon ? t("update_coupon") : t("create_coupon")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Coupon Dialog */}
      {selectedCoupon && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("delete_coupon")}</DialogTitle>
              <DialogDescription>
                {t("delete_coupon_confirmation", { code: selectedCoupon.code })}
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t("delete_coupon_warning", { uses: selectedCoupon.usesCount })}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button variant="destructive">
                {t("delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}