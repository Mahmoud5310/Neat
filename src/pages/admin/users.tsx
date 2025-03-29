import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
  Shield,
  Mail
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
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// This would normally come from your API
const mockUsers = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    role: "user", 
    status: "active", 
    orders: 7,
    lastLogin: "2023-03-15T10:30:00Z",
    registered: "2022-08-10T14:20:00Z",
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    role: "admin", 
    status: "active", 
    orders: 0,
    lastLogin: "2023-03-20T08:45:00Z",
    registered: "2022-05-18T09:15:00Z",
  },
  { 
    id: 3, 
    name: "Mike Johnson", 
    email: "mike@example.com", 
    role: "user", 
    status: "inactive", 
    orders: 3,
    lastLogin: "2023-02-28T16:20:00Z",
    registered: "2022-11-05T11:30:00Z",
  },
  { 
    id: 4, 
    name: "Sarah Williams", 
    email: "sarah@example.com", 
    role: "user", 
    status: "suspended", 
    orders: 12,
    lastLogin: "2023-03-18T13:10:00Z",
    registered: "2022-07-22T10:45:00Z",
  },
  { 
    id: 5, 
    name: "Alex Brown", 
    email: "alex@example.com", 
    role: "user", 
    status: "active", 
    orders: 5,
    lastLogin: "2023-03-21T09:30:00Z",
    registered: "2022-09-14T15:20:00Z",
  },
];

export default function AdminUsers() {
  const { user, logoutMutation } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  // Filter users based on search query and status filter
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === "ar" ? "ar-SA" : "en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">{t("active")}</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">{t("inactive")}</Badge>;
      case "suspended":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">{t("suspended")}</Badge>;
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
            <Button
              key={index}
              variant="ghost"
              className={`justify-start my-1 ${sidebarCollapsed ? "mx-auto px-0 w-12" : "mx-2"} ${item.path === '/admin/users' ? 'bg-primary/10' : ''}`}
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

        {/* Users Page Content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{t("users_management")}</h1>
            <p className="text-muted-foreground">{t("manage_users_description")}</p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("search_users")} 
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
                  <SelectItem value="all">{t("all_users")}</SelectItem>
                  <SelectItem value="active">{t("active_users")}</SelectItem>
                  <SelectItem value="inactive">{t("inactive_users")}</SelectItem>
                  <SelectItem value="suspended">{t("suspended_users")}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button>
                {t("add_new_user")}
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t("user")}</TableHead>
                    <TableHead>{t("role")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("orders")}</TableHead>
                    <TableHead>{t("registered")}</TableHead>
                    <TableHead>{t("last_login")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={(user.email === 'admin@neat.com' || user.email === 'admin@example.com') ? "default" : "secondary"}>
                          {(user.email === 'admin@neat.com' || user.email === 'admin@example.com') ? t("admin") : t("user")}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.orders}</TableCell>
                      <TableCell>{formatDate(user.registered)}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("user_actions")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("edit_user")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              {t("send_email")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              {t("change_role")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("delete_user")}
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

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("edit_user")}</DialogTitle>
              <DialogDescription>
                {t("edit_user_details_description")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t("name")}
                </label>
                <Input id="name" defaultValue={selectedUser.name} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </label>
                <Input id="email" defaultValue={selectedUser.email} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="role" className="text-sm font-medium">
                  {t("role")}
                </label>
                <Select defaultValue={(selectedUser.email === 'admin@neat.com' || selectedUser.email === 'admin@example.com') ? "admin" : "user"}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder={t("select_role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">{t("user")}</SelectItem>
                    <SelectItem value="admin">{t("admin")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-sm font-medium">
                  {t("status")}
                </label>
                <Select defaultValue={selectedUser.status}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t("select_status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("active")}</SelectItem>
                    <SelectItem value="inactive">{t("inactive")}</SelectItem>
                    <SelectItem value="suspended">{t("suspended")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save_changes")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Dialog */}
      {selectedUser && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("delete_user")}</DialogTitle>
              <DialogDescription>
                {t("delete_user_confirmation", { name: selectedUser.name })}
              </DialogDescription>
            </DialogHeader>
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