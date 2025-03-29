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
  Eye,
  Copy,
  Download,
  Plus,
  ArrowUpDown,
  Filter
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// This would normally come from your API
const mockProjects = [
  { 
    id: 1, 
    title: "E-commerce Platform", 
    category: "Web Development",
    price: 299.99,
    salesCount: 152,
    rating: 4.7,
    status: "active",
    featured: true,
    createdAt: "2022-10-15T08:30:00Z",
    thumbnail: "/projects/ecommerce.jpg"
  },
  { 
    id: 2, 
    title: "Social Media Dashboard", 
    category: "UI/UX Design",
    price: 199.99,
    salesCount: 87,
    rating: 4.3,
    status: "active",
    featured: false,
    createdAt: "2022-11-20T14:45:00Z",
    thumbnail: "/projects/dashboard.jpg"
  },
  { 
    id: 3, 
    title: "AI Image Generator", 
    category: "AI/ML",
    price: 499.99,
    salesCount: 64,
    rating: 4.8,
    status: "active",
    featured: true,
    createdAt: "2023-01-05T10:15:00Z",
    thumbnail: "/projects/ai-generator.jpg"
  },
  { 
    id: 4, 
    title: "Mobile Fitness App", 
    category: "Mobile Development",
    price: 149.99,
    salesCount: 210,
    rating: 4.5,
    status: "inactive",
    featured: false,
    createdAt: "2022-08-12T16:20:00Z",
    thumbnail: "/projects/fitness-app.jpg"
  },
  { 
    id: 5, 
    title: "Blockchain Wallet", 
    category: "Blockchain",
    price: 599.99,
    salesCount: 42,
    rating: 4.2,
    status: "active",
    featured: false,
    createdAt: "2023-02-18T09:30:00Z",
    thumbnail: "/projects/blockchain.jpg"
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

export default function AdminProjects() {
  const { user, logoutMutation } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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

  // Filter and sort projects
  const filteredProjects = mockProjects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "sales":
          comparison = a.salesCount - b.salesCount;
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        default:
          comparison = a.id - b.id;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === "ar" ? "ar-SA" : "en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currentLanguage === "ar" ? "ar-SA" : "en-US", {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getTotalRevenue = () => {
    return mockProjects.reduce((sum, project) => sum + (project.price * project.salesCount), 0);
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
              className={`justify-start my-1 ${sidebarCollapsed ? "mx-auto px-0 w-12" : "mx-2"} ${item.path === '/admin/projects' ? 'bg-primary/10' : ''}`}
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

        {/* Projects Page Content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{t("projects_management")}</h1>
            <p className="text-muted-foreground">{t("manage_projects_description")}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("total_projects")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProjects.length}</div>
                <p className="text-xs text-muted-foreground">
                  {mockProjects.filter(p => p.status === "active").length} {t("active_projects")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("total_sales")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockProjects.reduce((total, project) => total + project.salesCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("across_all_projects")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("total_revenue")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(getTotalRevenue())}</div>
                <p className="text-xs text-muted-foreground">
                  {t("average_per_project", { 
                    amount: formatCurrency(getTotalRevenue() / mockProjects.length) 
                  })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("search_projects")} 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 items-center">
              <Select 
                value={categoryFilter} 
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("filter_by_category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_categories")}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t("filter_by_status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_statuses")}</SelectItem>
                  <SelectItem value="active">{t("active")}</SelectItem>
                  <SelectItem value="inactive">{t("inactive")}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("add_project")}
              </Button>
            </div>
          </div>

          {/* Projects Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("title")}>
                        {t("project")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("category")}>
                        {t("category")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("price")}>
                        {t("price")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("sales")}>
                        {t("sales")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("rating")}>
                        {t("rating")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{project.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(project.createdAt)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{project.category}</TableCell>
                      <TableCell>{formatCurrency(project.price)}</TableCell>
                      <TableCell>{project.salesCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          {project.rating}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={project.status === "active" ? "outline" : "secondary"}>
                          {project.status === "active" ? t("active") : t("inactive")}
                        </Badge>
                        {project.featured && (
                          <Badge variant="default" className="ml-2">
                            {t("featured")}
                          </Badge>
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
                            <DropdownMenuLabel>{t("project_actions")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("edit_project")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("view_details")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Tag className="mr-2 h-4 w-4" />
                              {project.featured ? t("unmark_featured") : t("mark_featured")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteProject(project)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("delete_project")}
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

      {/* Add/Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedProject ? t("edit_project") : t("add_new_project")}</DialogTitle>
            <DialogDescription>
              {selectedProject ? t("edit_project_description") : t("add_project_description")}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">{t("general_info")}</TabsTrigger>
              <TabsTrigger value="pricing">{t("pricing")}</TabsTrigger>
              <TabsTrigger value="media">{t("media")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="py-4">
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">{t("project_title")}</Label>
                  <Input 
                    id="title" 
                    defaultValue={selectedProject?.title || ""} 
                    placeholder={t("enter_project_title")}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="category">{t("category")}</Label>
                    <Select defaultValue={selectedProject?.category || ""}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder={t("select_category")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="status">{t("status")}</Label>
                    <Select defaultValue={selectedProject?.status || "active"}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder={t("select_status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t("active")}</SelectItem>
                        <SelectItem value="inactive">{t("inactive")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea 
                    id="description" 
                    placeholder={t("enter_project_description")}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="price">{t("base_price")}</Label>
                    <Input 
                      id="price" 
                      type="number"
                      defaultValue={selectedProject?.price || ""} 
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="discount">{t("discount_percentage")}</Label>
                    <Input 
                      id="discount" 
                      type="number"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="featured" className="rounded border-gray-300" />
                  <Label htmlFor="featured" className="text-sm">
                    {t("mark_as_featured")}
                  </Label>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sale_notes">{t("sale_notes")}</Label>
                  <Textarea 
                    id="sale_notes" 
                    placeholder={t("enter_sale_notes")}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="py-4">
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label>{t("project_thumbnail")}</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="mb-4 w-40 h-40 bg-muted rounded-md flex items-center justify-center">
                      <Download className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <Button variant="secondary">
                      {t("upload_image")}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t("recommended_size")}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label>{t("project_gallery")}</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <p className="text-muted-foreground mb-2">
                      {t("drag_drop_images")}
                    </p>
                    <Button variant="secondary">
                      {t("browse_files")}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">
              {selectedProject ? t("update_project") : t("create_project")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      {selectedProject && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("delete_project")}</DialogTitle>
              <DialogDescription>
                {t("delete_project_confirmation", { title: selectedProject.title })}
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t("delete_project_warning", { sales: selectedProject.salesCount })}
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

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("add_new_project")}</DialogTitle>
            <DialogDescription>
              {t("add_project_description")}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">{t("general_info")}</TabsTrigger>
              <TabsTrigger value="pricing">{t("pricing")}</TabsTrigger>
              <TabsTrigger value="media">{t("media")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="py-4">
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="new-title">{t("project_title")}</Label>
                  <Input 
                    id="new-title" 
                    placeholder={t("enter_project_title")}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="new-category">{t("category")}</Label>
                    <Select>
                      <SelectTrigger id="new-category">
                        <SelectValue placeholder={t("select_category")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="new-status">{t("status")}</Label>
                    <Select defaultValue="active">
                      <SelectTrigger id="new-status">
                        <SelectValue placeholder={t("select_status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t("active")}</SelectItem>
                        <SelectItem value="inactive">{t("inactive")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="new-description">{t("description")}</Label>
                  <Textarea 
                    id="new-description" 
                    placeholder={t("enter_project_description")}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="new-price">{t("base_price")}</Label>
                    <Input 
                      id="new-price" 
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="new-discount">{t("discount_percentage")}</Label>
                    <Input 
                      id="new-discount" 
                      type="number"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="new-featured" className="rounded border-gray-300" />
                  <Label htmlFor="new-featured" className="text-sm">
                    {t("mark_as_featured")}
                  </Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="py-4">
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label>{t("project_thumbnail")}</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="mb-4 w-40 h-40 bg-muted rounded-md flex items-center justify-center">
                      <Download className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <Button variant="secondary">
                      {t("upload_image")}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t("recommended_size")}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">
              {t("create_project")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}