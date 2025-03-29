import { 
  users, type User, type InsertUser, 
  projects, type Project, type InsertProject, 
  categories, type Category, type InsertCategory,
  orders, type Order, type InsertOrder,
  coupons, type Coupon, type InsertCoupon,
  couponUsages, type CouponUsage, type InsertCouponUsage,
  testimonials, type Testimonial, type InsertTestimonial,
  analytics, type Analytics, type InsertAnalytics,
  blogCategories, type BlogCategory, type InsertBlogCategory,
  blogPosts, type BlogPost, type InsertBlogPost,
  blogComments, type BlogComment, type InsertBlogComment,
  chatMessages, type ChatMessage, type InsertChatMessage,
  chatSessions, type ChatSession, type InsertChatSession,
  autoResponses, type AutoResponse, type InsertAutoResponse
} from "@shared/schema";
import session from "express-session";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getFeaturedProjects(limit?: number): Promise<Project[]>;
  getProjectsByCategory(categoryId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  searchProjects(query: string): Promise<Project[]>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Coupon operations
  getCoupon(code: string): Promise<Coupon | undefined>;
  validateCoupon(code: string, userId: number): Promise<{ valid: boolean; message?: string; discount?: number }>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  useCoupon(usage: InsertCouponUsage): Promise<CouponUsage>;
  
  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Analytics operations
  trackEvent(analytics: InsertAnalytics): Promise<Analytics>;
  getUserAnalytics(userId: number): Promise<Analytics[]>;
  getEventsByType(eventType: string): Promise<Analytics[]>;
  getPageViewStats(): Promise<{ page: string; count: number }[]>;
  getRecentAnalytics(limit?: number): Promise<Analytics[]>;
  
  // Blog categories operations
  getBlogCategories(): Promise<BlogCategory[]>;
  getBlogCategory(id: number): Promise<BlogCategory | undefined>;
  getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined>;
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  
  // Blog posts operations
  getBlogPosts(options?: { limit?: number; categoryId?: number; tag?: string }): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getRelatedBlogPosts(postId: number, limit?: number): Promise<BlogPost[]>;
  getFeaturedBlogPosts(limit?: number): Promise<BlogPost[]>;
  searchBlogPosts(query: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  incrementBlogPostView(id: number): Promise<BlogPost | undefined>;
  
  // Blog comments operations
  getBlogComments(postId: number): Promise<BlogComment[]>;
  getBlogComment(id: number): Promise<BlogComment | undefined>;
  createBlogComment(comment: InsertBlogComment): Promise<BlogComment>;
  approveBlogComment(id: number): Promise<BlogComment | undefined>;
  getBlogPostCommentCount(postId: number): Promise<number>;
  
  // Chat operations
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  getChatMessage(id: number): Promise<ChatMessage | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  markChatMessagesAsRead(sessionId: string): Promise<void>;
  getUnreadMessageCount(sessionId: string): Promise<number>;
  
  // Chat session operations
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSessionActivity(sessionId: string): Promise<ChatSession | undefined>;
  getActiveChatSessions(): Promise<ChatSession[]>;
  
  // Auto response operations
  getAutoResponses(): Promise<AutoResponse[]>;
  getAutoResponse(id: number): Promise<AutoResponse | undefined>;
  createAutoResponse(autoResponse: InsertAutoResponse): Promise<AutoResponse>;
  findAutoResponseByKeyword(message: string): Promise<AutoResponse | undefined>;
  
  // Session store
  sessionStore: any; // Using any type to avoid import issues
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private projectsMap: Map<number, Project>;
  private categoriesMap: Map<number, Category>;
  private ordersMap: Map<number, Order>;
  private couponsMap: Map<number, Coupon>;
  private couponUsagesMap: Map<number, CouponUsage>;
  private testimonialsMap: Map<number, Testimonial>;
  private analyticsMap: Map<number, Analytics>;
  private blogCategoriesMap: Map<number, BlogCategory>;
  private blogPostsMap: Map<number, BlogPost>;
  private blogCommentsMap: Map<number, BlogComment>;
  private chatMessagesMap: Map<number, ChatMessage>;
  private chatSessionsMap: Map<string, ChatSession>;
  private autoResponsesMap: Map<number, AutoResponse>;
  
  sessionStore: any; // Using any type to avoid import issues
  private userIdCounter: number;
  private projectIdCounter: number;
  private categoryIdCounter: number;
  private orderIdCounter: number;
  private couponIdCounter: number;
  private couponUsageIdCounter: number;
  private testimonialIdCounter: number;
  private analyticsIdCounter: number;
  private blogCategoryIdCounter: number;
  private blogPostIdCounter: number;
  private blogCommentIdCounter: number;
  private chatMessageIdCounter: number;
  private autoResponseIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.projectsMap = new Map();
    this.categoriesMap = new Map();
    this.ordersMap = new Map();
    this.couponsMap = new Map();
    this.couponUsagesMap = new Map();
    this.testimonialsMap = new Map();
    this.analyticsMap = new Map();
    this.blogCategoriesMap = new Map();
    this.blogPostsMap = new Map();
    this.blogCommentsMap = new Map();
    this.chatMessagesMap = new Map();
    this.chatSessionsMap = new Map();
    this.autoResponsesMap = new Map();
    
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.categoryIdCounter = 1;
    this.orderIdCounter = 1;
    this.couponIdCounter = 1;
    this.couponUsageIdCounter = 1;
    this.testimonialIdCounter = 1;
    this.analyticsIdCounter = 1;
    this.blogCategoryIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.blogCommentIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.autoResponseIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Seed initial data
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    // Ensure all required fields are present with proper null handling
    const user: User = { 
      id,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName || null,
      createdAt 
    };
    this.usersMap.set(id, user);
    return user;
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projectsMap.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projectsMap.get(id);
  }

  async getFeaturedProjects(limit: number = 6): Promise<Project[]> {
    return Array.from(this.projectsMap.values())
      .filter(project => project.featuredOrder !== null && project.featuredOrder !== undefined)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
      .slice(0, limit);
  }

  async getProjectsByCategory(categoryId: number): Promise<Project[]> {
    return Array.from(this.projectsMap.values())
      .filter(project => project.categoryId === categoryId);
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const createdAt = new Date();
    // Ensure all required fields are present with proper null handling
    const project: Project = { 
      id,
      title: projectData.title,
      titleAr: projectData.titleAr,
      description: projectData.description,
      descriptionAr: projectData.descriptionAr,
      price: projectData.price,
      categoryId: projectData.categoryId,
      imageUrl: projectData.imageUrl,
      downloadUrl: projectData.downloadUrl,
      demoUrl: projectData.demoUrl || null,
      technologies: projectData.technologies || null,
      featuredOrder: projectData.featuredOrder || null,
      createdAt
    };
    this.projectsMap.set(id, project);
    return project;
  }
  
  async searchProjects(query: string): Promise<Project[]> {
    const lowerCaseQuery = query.toLowerCase();
    return Array.from(this.projectsMap.values())
      .filter(project => 
        project.title.toLowerCase().includes(lowerCaseQuery) || 
        project.description.toLowerCase().includes(lowerCaseQuery) ||
        project.titleAr.toLowerCase().includes(lowerCaseQuery) || 
        project.descriptionAr.toLowerCase().includes(lowerCaseQuery)
      );
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categoriesMap.get(id);
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    // Ensure all required fields are present with proper null handling
    const category: Category = { 
      id,
      name: categoryData.name,
      nameAr: categoryData.nameAr,
      icon: categoryData.icon,
      projectCount: categoryData.projectCount || null
    };
    this.categoriesMap.set(id, category);
    return category;
  }

  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.ordersMap.values())
      .filter(order => order.userId === userId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.ordersMap.get(id);
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const createdAt = new Date();
    // Ensure all required fields are present with proper null handling
    const order: Order = { 
      id,
      userId: orderData.userId,
      projectId: orderData.projectId,
      price: orderData.price,
      finalPrice: orderData.finalPrice,
      status: orderData.status,
      paymentMethod: orderData.paymentMethod,
      discountApplied: orderData.discountApplied || null,
      paymentReference: orderData.paymentReference || null,
      createdAt
    };
    this.ordersMap.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.ordersMap.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.ordersMap.set(id, updatedOrder);
    return updatedOrder;
  }

  // Coupon operations
  async getCoupon(code: string): Promise<Coupon | undefined> {
    return Array.from(this.couponsMap.values())
      .find(coupon => coupon.code.toLowerCase() === code.toLowerCase());
  }
  
  async validateCoupon(code: string, userId: number): Promise<{ valid: boolean; message?: string; discount?: number }> {
    // Special handling for Neat@#2 coupon
    if (code === 'Neat@#2') {
      // Check if user has used any coupon before
      const hasUsedCoupon = Array.from(this.couponUsagesMap.values())
        .some(usage => usage.userId === userId);
      
      if (hasUsedCoupon) {
        return { valid: false, message: "You can only use this coupon for your first purchase" };
      }
      
      return { valid: true, discount: 50 };
    }

    const coupon = await this.getCoupon(code);
    
    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }
    
    if (!coupon.active) {
      return { valid: false, message: "This coupon is no longer active" };
    }
    
    const now = new Date();
    if (coupon.startDate > now) {
      return { valid: false, message: "This coupon is not yet active" };
    }
    
    if (coupon.endDate && coupon.endDate < now) {
      return { valid: false, message: "This coupon has expired" };
    }
    
    // Check if user has already used this coupon
    const hasUsed = Array.from(this.couponUsagesMap.values())
      .some(usage => usage.couponId === coupon.id && usage.userId === userId);
    
    if (hasUsed) {
      return { valid: false, message: "You have already used this coupon" };
    }
    
    return { valid: true, discount: coupon.discountPercent };
  }
  
  async createCoupon(couponData: InsertCoupon): Promise<Coupon> {
    const id = this.couponIdCounter++;
    // Ensure all required fields are present with proper null handling
    const coupon: Coupon = { 
      id,
      code: couponData.code,
      discountPercent: couponData.discountPercent,
      startDate: couponData.startDate,
      endDate: couponData.endDate || null,
      active: couponData.active || null
    };
    this.couponsMap.set(id, coupon);
    return coupon;
  }
  
  async useCoupon(usageData: InsertCouponUsage): Promise<CouponUsage> {
    const id = this.couponUsageIdCounter++;
    const usedAt = new Date();
    const usage: CouponUsage = { 
      id,
      couponId: usageData.couponId,
      userId: usageData.userId,
      orderId: usageData.orderId,
      usedAt
    };
    this.couponUsagesMap.set(id, usage);
    return usage;
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonialsMap.values());
  }
  
  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    // Ensure all required fields are present with proper null handling
    const testimonial: Testimonial = { 
      id,
      customerName: testimonialData.customerName,
      customerNameAr: testimonialData.customerNameAr,
      content: testimonialData.content,
      contentAr: testimonialData.contentAr,
      rating: testimonialData.rating,
      position: testimonialData.position || null,
      positionAr: testimonialData.positionAr || null,
      avatarUrl: testimonialData.avatarUrl || null
    };
    this.testimonialsMap.set(id, testimonial);
    return testimonial;
  }
  
  // Analytics operations
  async trackEvent(analyticsData: InsertAnalytics): Promise<Analytics> {
    const id = this.analyticsIdCounter++;
    const createdAt = new Date();
    // Ensure all required fields are present with proper null handling
    const analytics: Analytics = { 
      id,
      userId: analyticsData.userId,
      event: analyticsData.event,
      page: analyticsData.page,
      metadata: analyticsData.metadata || null,
      createdAt
    };
    this.analyticsMap.set(id, analytics);
    return analytics;
  }
  
  async getUserAnalytics(userId: number): Promise<Analytics[]> {
    return Array.from(this.analyticsMap.values())
      .filter(analytics => analytics.userId === userId);
  }
  
  async getEventsByType(eventType: string): Promise<Analytics[]> {
    return Array.from(this.analyticsMap.values())
      .filter(analytics => analytics.event === eventType);
  }
  
  async getPageViewStats(): Promise<{ page: string; count: number }[]> {
    const pageViews = Array.from(this.analyticsMap.values())
      .filter(analytics => analytics.event === 'page_view');
    
    const pageCount = new Map<string, number>();
    
    for (const view of pageViews) {
      const page = view.page;
      const currentCount = pageCount.get(page) || 0;
      pageCount.set(page, currentCount + 1);
    }
    
    return Array.from(pageCount.entries()).map(([page, count]) => ({ page, count }));
  }
  
  async getRecentAnalytics(limit: number = 100): Promise<Analytics[]> {
    return Array.from(this.analyticsMap.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Seed data for development
  private seedData() {
    // Seed auto responses
    const autoResponses: InsertAutoResponse[] = [
      {
        keyword: "hello",
        response: "Hello! Welcome to Neat. How can I help you today?",
        active: true
      },
      {
        keyword: "hi",
        response: "Hi there! Welcome to Neat. How can I assist you today?",
        active: true
      },
      {
        keyword: "price",
        response: "Our project prices vary based on complexity and features. You can browse our catalog to see pricing for each project. Feel free to ask about any specific project!",
        active: true
      },
      {
        keyword: "discount",
        response: "We offer a special 50% discount with the coupon code 'Neat@#2' for first-time buyers! The discount will be available starting April 1st, 2025.",
        active: true
      },
      {
        keyword: "payment",
        response: "We accept payments through PayPal and Vodafone Cash. Please note that PayPal integration is currently under maintenance.",
        active: true
      },
      {
        keyword: "contact",
        response: "You can reach our support team through this chat or email us at support@neat.com. We're available 24/7!",
        active: true
      },
      {
        keyword: "thanks",
        response: "You're welcome! Feel free to reach out if you need anything else.",
        active: true
      }
    ];
    
    for (const response of autoResponses) {
      this.createAutoResponse(response);
    }

    // Seed categories
    const categories: InsertCategory[] = [
      {
        name: "E-commerce",
        nameAr: "متاجر إلكترونية",
        icon: "fa-store",
        projectCount: 12
      },
      {
        name: "Mobile Apps",
        nameAr: "تطبيقات الجوال",
        icon: "fa-mobile-alt",
        projectCount: 8
      },
      {
        name: "Productivity",
        nameAr: "الإنتاجية",
        icon: "fa-tasks",
        projectCount: 15
      },
      {
        name: "Analytics",
        nameAr: "التحليلات",
        icon: "fa-chart-line",
        projectCount: 6
      }
    ];
    
    for (const category of categories) {
      this.createCategory(category);
    }
    
    // Seed projects
    const projects: InsertProject[] = [
      {
        title: "E-commerce Platform",
        titleAr: "منصة تجارة إلكترونية",
        description: "The Smart Learning Platform offers high-quality courses with digital certificates and AI-powered recommendations for a seamless and interactive learning experience.",
        descriptionAr: "المنصة التعليمية الذكية توفر دورات عالية الجودة مع شهادات رقمية وذكاء اصطناعي يقترح الدورات المناسبة، لتجربة تعلم سلسة وتفاعلية.",
        price: 199,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        demoUrl: "https://demo.example.com/ecommerce",
        downloadUrl: "/downloads/ecommerce-platform.zip",
        technologies: ["React", "Node.js", "MongoDB"],
        featuredOrder: 1
      },
      {
        title: "Task Management App",
        titleAr: "تطبيق إدارة المهام",
        description: "Collaborative task management with drag-and-drop interface, notifications, and timeline view.",
        descriptionAr: "إدارة مهام تعاونية مع واجهة سحب وإفلات، إشعارات، وعرض خط زمني.",
        price: 149,
        categoryId: 3,
        imageUrl: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e",
        demoUrl: "https://demo.example.com/taskmanager",
        downloadUrl: "/downloads/task-manager.zip",
        technologies: ["Vue.js", "Express", "PostgreSQL"],
        featuredOrder: 2
      },
      {
        title: "Social Network",
        titleAr: "شبكة اجتماعية",
        description: "Complete social platform with profiles, news feed, messaging, and notifications system.",
        descriptionAr: "صوتي - منصة تواصل اجتماعي تتيح للجميع النشر والتفاعل بدون تسجيل، مع دعم الحسابات الرسمية فقط.",
        price: 249,
        categoryId: 2,
        imageUrl: "https://images.unsplash.com/photo-1535223289827-42f1e9919769",
        demoUrl: "https://demo.example.com/socialnetwork",
        downloadUrl: "/downloads/social-network.zip",
        technologies: ["React", "Firebase", "Node.js"],
        featuredOrder: 3
      },
      {
        title: "Advanced CRM System",
        titleAr: "نظام إدارة علاقات العملاء المتقدم",
        description: "A comprehensive Customer Relationship Management system with lead tracking, customer segmentation, email campaigns, and detailed analytics dashboard.",
        descriptionAr: "نظام شامل لإدارة علاقات العملاء مع تتبع العملاء المحتملين، تقسيم العملاء، حملات البريد الإلكتروني، ولوحة تحكم تحليلية مفصلة.",
        price: 329,
        categoryId: 3,
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692",
        demoUrl: "https://demo.example.com/crm",
        downloadUrl: "/downloads/advanced-crm.zip",
        technologies: ["React", "Node.js", "MongoDB", "Express", "AWS", "RESTful API"],
        featuredOrder: 0
      }
    ];
    
    for (const project of projects) {
      this.createProject(project);
    }
    
    // Seed testimonials
    const testimonials: InsertTestimonial[] = [
      {
        customerName: "Michael Johnson",
        customerNameAr: "محمد عبدالله",
        position: "Web Developer",
        positionAr: "مطور ويب",
        content: "The e-commerce platform I purchased was exceptional. The code was clean, well-documented, and easy to customize. It saved me months of development time.",
        contentAr: "منصة التجارة الإلكترونية التي اشتريتها كانت استثنائية. الكود كان نظيفًا، موثقًا جيدًا، وسهل التخصيص. لقد وفرت علي شهورًا من وقت التطوير.",
        rating: 5,
        avatarUrl: "https://i.pravatar.cc/150?img=3"
      },
      {
        customerName: "Sarah Williams",
        customerNameAr: "سارة أحمد",
        position: "Project Manager",
        positionAr: "مديرة مشاريع",
        content: "I purchased the CRM system and it exceeded my expectations. The code structure is impressive and the documentation made implementation a breeze.",
        contentAr: "اشتريت نظام إدارة علاقات العملاء وفاق توقعاتي. هيكل الكود مثير للإعجاب والتوثيق جعل التنفيذ سهلاً للغاية.",
        rating: 4,
        avatarUrl: "https://i.pravatar.cc/150?img=5"
      },
      {
        customerName: "David Rodriguez",
        customerNameAr: "داوود محمد",
        position: "Startup Founder",
        positionAr: "مؤسس شركة ناشئة",
        content: "The social media project I bought was exactly what my startup needed. The support provided was outstanding and the code quality is top-notch.",
        contentAr: "مشروع وسائل التواصل الاجتماعي الذي اشتريته كان بالضبط ما تحتاجه شركتي الناشئة. الدعم المقدم كان ممتازاً وجودة الكود من الدرجة الأولى.",
        rating: 5,
        avatarUrl: "https://i.pravatar.cc/150?img=7"
      }
    ];
    
    for (const testimonial of testimonials) {
      this.createTestimonial(testimonial);
    }
    
    // Create a coupon for testing
    this.createCoupon({
      code: "HALF50",
      discountPercent: 50,
      startDate: new Date("2025-04-01"),
      active: true
    });
    
    // Seed blog categories
    this.seedBlogCategories();
    
    // Seed blog posts
    this.seedBlogPosts();
  }
  
  // Blog seed data
  private seedBlogCategories() {
    const blogCategories: InsertBlogCategory[] = [
      {
        name: "JavaScript",
        nameAr: "جافاسكريبت",
        slug: "javascript",
        description: "Articles about JavaScript programming, frameworks, and best practices",
        descriptionAr: "مقالات حول برمجة جافاسكريبت، أطر العمل، وأفضل الممارسات",
        icon: "code-js"
      },
      {
        name: "Python",
        nameAr: "بايثون",
        slug: "python",
        description: "Tutorials and guides for Python development",
        descriptionAr: "برامج تعليمية وأدلة لتطوير بايثون",
        icon: "code-python"
      },
      {
        name: "React",
        nameAr: "رياكت",
        slug: "react",
        description: "Everything about React.js development and ecosystem",
        descriptionAr: "كل شيء عن تطوير React.js ونظامه البيئي",
        icon: "code-react"
      },
      {
        name: "Artificial Intelligence",
        nameAr: "الذكاء الاصطناعي",
        slug: "ai",
        description: "Latest trends in AI, machine learning, and deep learning",
        descriptionAr: "أحدث اتجاهات الذكاء الاصطناعي والتعلم الآلي والتعلم العميق",
        icon: "brain"
      },
      {
        name: "Web Development",
        nameAr: "تطوير الويب",
        slug: "web-development",
        description: "Web development techniques, tools, and technologies",
        descriptionAr: "تقنيات تطوير الويب وأدواته وتقنياته",
        icon: "globe"
      }
    ];
    
    for (const category of blogCategories) {
      this.createBlogCategory(category);
    }
  }
  
  private seedBlogPosts() {
    // Sample blog posts will be created with the corresponding blog categories
    const samplePosts: InsertBlogPost[] = [
      {
        title: "Getting Started with React Hooks",
        titleAr: "البدء مع React Hooks",
        slug: "getting-started-with-react-hooks",
        summary: "Learn the basics of React Hooks and how they can simplify your components",
        summaryAr: "تعلم أساسيات React Hooks وكيف يمكنها تبسيط المكونات الخاصة بك",
        content: "## Introduction to React Hooks\n\nReact Hooks are a new addition in React 16.8 that let you use state and other React features without writing a class. In this tutorial, we will explore the most commonly used hooks and how they can make your code cleaner and more reusable.\n\n## useState Hook\n\nThe useState hook lets you add state to functional components...",
        contentAr: "## مقدمة في React Hooks\n\nReact Hooks هي إضافة جديدة في React 16.8 تتيح لك استخدام الحالة وميزات React الأخرى دون كتابة فئة. في هذا البرنامج التعليمي، سنستكشف الخطافات الأكثر استخدامًا وكيف يمكنها جعل التعليمات البرمجية الخاصة بك أنظف وأكثر قابلية لإعادة الاستخدام.\n\n## useState Hook\n\nيتيح لك خطاف useState إضافة حالة إلى المكونات الوظيفية...",
        categoryId: 3, // React category
        authorId: 1,
        featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
        tags: ["react", "hooks", "javascript", "frontend"],
        tagsAr: ["رياكت", "هوكس", "جافاسكريبت", "الواجهة الأمامية"],
        isPublished: true,
        publishedAt: new Date("2025-03-01"),
        metaTitle: "Getting Started with React Hooks - Complete Guide",
        metaDescription: "Learn how to use React Hooks to simplify your components and make them more reusable"
      },
      {
        title: "Building AI Applications with Python",
        titleAr: "بناء تطبيقات الذكاء الاصطناعي باستخدام بايثون",
        slug: "building-ai-applications-with-python",
        summary: "A comprehensive guide to developing AI applications using Python and popular libraries",
        summaryAr: "دليل شامل لتطوير تطبيقات الذكاء الاصطناعي باستخدام بايثون والمكتبات الشائعة",
        content: "## Introduction to AI with Python\n\nPython has become the language of choice for AI development due to its simplicity and the rich ecosystem of libraries. In this article, we'll explore how to build practical AI applications using libraries like TensorFlow, PyTorch, and scikit-learn.\n\n## Setting Up Your Environment\n\nBefore we start building, let's set up a proper development environment...",
        contentAr: "## مقدمة للذكاء الاصطناعي مع بايثون\n\nأصبحت بايثون لغة الاختيار لتطوير الذكاء الاصطناعي بسبب بساطتها والنظام البيئي الغني للمكتبات. في هذه المقالة، سنستكشف كيفية بناء تطبيقات الذكاء الاصطناعي العملية باستخدام مكتبات مثل TensorFlow و PyTorch و scikit-learn.\n\n## إعداد بيئتك\n\nقبل أن نبدأ في البناء، دعنا نقوم بإعداد بيئة تطوير مناسبة...",
        categoryId: 4, // AI category
        authorId: 1,
        featuredImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        tags: ["python", "artificial intelligence", "machine learning", "tensorflow"],
        tagsAr: ["بايثون", "الذكاء الاصطناعي", "تعلم الآلة", "تنسرفلو"],
        isPublished: true,
        publishedAt: new Date("2025-03-15"),
        metaTitle: "Building AI Applications with Python - Practical Guide",
        metaDescription: "Learn to develop practical AI applications using Python, TensorFlow, PyTorch, and scikit-learn"
      },
      {
        title: "Modern JavaScript Features You Should Know",
        titleAr: "ميزات جافاسكريبت الحديثة التي يجب أن تعرفها",
        slug: "modern-javascript-features-you-should-know",
        summary: "Explore the latest JavaScript features that can improve your code quality and productivity",
        summaryAr: "استكشف أحدث ميزات جافاسكريبت التي يمكن أن تحسن جودة الكود وإنتاجيتك",
        content: "## Evolution of JavaScript\n\nJavaScript has evolved significantly over the past few years. ES6 (ECMAScript 2015) and subsequent versions have introduced powerful features that make code more readable, maintainable, and expressive.\n\n## Arrow Functions\n\nArrow functions provide a concise syntax for writing functions...",
        contentAr: "## تطور جافاسكريبت\n\nتطورت جافاسكريبت بشكل كبير على مدار السنوات القليلة الماضية. قدم ES6 (ECMAScript 2015) والإصدارات اللاحقة ميزات قوية تجعل الكود أكثر قابلية للقراءة والصيانة والتعبير.\n\n## Arrow Functions\n\nتوفر دوال السهم بناء جملة موجزًا لكتابة الدوال...",
        categoryId: 1, // JavaScript category
        authorId: 1,
        featuredImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
        tags: ["javascript", "es6", "web development", "programming"],
        tagsAr: ["جافاسكريبت", "اي اس 6", "تطوير الويب", "البرمجة"],
        isPublished: true,
        publishedAt: new Date("2025-02-10"),
        // Remove the updatedAt property to match the type
        metaTitle: "Modern JavaScript Features You Should Know in 2025",
        metaDescription: "Discover the most important JavaScript features that every developer should master for better code"
      }
    ];
    
    for (const post of samplePosts) {
      this.createBlogPost(post);
    }
  }

  // Blog categories operations
  async getBlogCategories(): Promise<BlogCategory[]> {
    return Array.from(this.blogCategoriesMap.values());
  }

  async getBlogCategory(id: number): Promise<BlogCategory | undefined> {
    return this.blogCategoriesMap.get(id);
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
    return Array.from(this.blogCategoriesMap.values())
      .find(category => category.slug === slug);
  }

  async createBlogCategory(categoryData: InsertBlogCategory): Promise<BlogCategory> {
    const id = this.blogCategoryIdCounter++;
    const createdAt = new Date();
    
    const category: BlogCategory = {
      id,
      name: categoryData.name,
      nameAr: categoryData.nameAr,
      slug: categoryData.slug,
      description: categoryData.description || null,
      descriptionAr: categoryData.descriptionAr || null,
      icon: categoryData.icon || null,
      createdAt
    };
    
    this.blogCategoriesMap.set(id, category);
    return category;
  }

  // Blog posts operations
  async getBlogPosts(options?: { limit?: number; categoryId?: number; tag?: string }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPostsMap.values())
      .filter(post => post.isPublished)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    
    if (options?.categoryId) {
      posts = posts.filter(post => post.categoryId === options.categoryId);
    }
    
    if (options?.tag) {
      posts = posts.filter(post => post.tags?.includes(options.tag!) || post.tagsAr?.includes(options.tag!));
    }
    
    if (options?.limit) {
      posts = posts.slice(0, options.limit);
    }
    
    return posts;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPostsMap.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPostsMap.values())
      .find(post => post.slug === slug);
  }

  async getRelatedBlogPosts(postId: number, limit: number = 3): Promise<BlogPost[]> {
    const post = this.blogPostsMap.get(postId);
    if (!post) return [];
    
    // Find related posts by category and tags
    return Array.from(this.blogPostsMap.values())
      .filter(p => p.id !== postId && p.isPublished)
      .filter(p => p.categoryId === post.categoryId || 
                  (post.tags && p.tags && post.tags.some(tag => p.tags?.includes(tag))))
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  async getFeaturedBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    // In a real app, you might have a featured flag, here we just return the latest posts
    return Array.from(this.blogPostsMap.values())
      .filter(post => post.isPublished)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
  }

  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    const lowerCaseQuery = query.toLowerCase();
    
    return Array.from(this.blogPostsMap.values())
      .filter(post => post.isPublished)
      .filter(post => 
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.titleAr.toLowerCase().includes(lowerCaseQuery) ||
        (post.summary && post.summary.toLowerCase().includes(lowerCaseQuery)) ||
        (post.summaryAr && post.summaryAr.toLowerCase().includes(lowerCaseQuery)) ||
        post.content.toLowerCase().includes(lowerCaseQuery) ||
        post.contentAr.toLowerCase().includes(lowerCaseQuery) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))) ||
        (post.tagsAr && post.tagsAr.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
      );
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const now = new Date();
    
    const post: BlogPost = {
      id,
      title: postData.title,
      titleAr: postData.titleAr,
      slug: postData.slug,
      summary: postData.summary || null,
      summaryAr: postData.summaryAr || null,
      content: postData.content,
      contentAr: postData.contentAr,
      categoryId: postData.categoryId || null,
      authorId: postData.authorId,
      featuredImage: postData.featuredImage || null,
      tags: postData.tags || null,
      tagsAr: postData.tagsAr || null,
      isPublished: postData.isPublished ?? true,
      viewCount: 0,
      publishedAt: postData.publishedAt || now,
      updatedAt: postData.updatedAt || now,
      metaTitle: postData.metaTitle || null,
      metaDescription: postData.metaDescription || null
    };
    
    this.blogPostsMap.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPostsMap.get(id);
    if (!post) return undefined;
    
    const updatedPost: BlogPost = {
      ...post,
      ...postData,
      updatedAt: new Date()
    };
    
    this.blogPostsMap.set(id, updatedPost);
    return updatedPost;
  }

  async incrementBlogPostView(id: number): Promise<BlogPost | undefined> {
    const post = this.blogPostsMap.get(id);
    if (!post) return undefined;
    
    const updatedPost: BlogPost = {
      ...post,
      viewCount: (post.viewCount ?? 0) + 1
    };
    
    this.blogPostsMap.set(id, updatedPost);
    return updatedPost;
  }

  // Blog comments operations
  async getBlogComments(postId: number): Promise<BlogComment[]> {
    return Array.from(this.blogCommentsMap.values())
      .filter(comment => comment.postId === postId && comment.isApproved)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getBlogComment(id: number): Promise<BlogComment | undefined> {
    return this.blogCommentsMap.get(id);
  }

  async createBlogComment(commentData: InsertBlogComment): Promise<BlogComment> {
    // Ensure commentData is explicitly typed as InsertBlogComment
    const id = this.blogCommentIdCounter++;
    const createdAt = new Date();
    
    const comment: BlogComment = {
      id,
      postId: commentData.postId,
      userId: commentData.userId || null,
      name: commentData.name || null,
      email: commentData.email || null,
      content: commentData.content,
      isApproved: commentData.isApproved ?? false,
      parentId: commentData.parentId || null,
      createdAt
    };
    
    this.blogCommentsMap.set(id, comment);
    return comment;
  }

  async approveBlogComment(id: number): Promise<BlogComment | undefined> {
    const comment = this.blogCommentsMap.get(id);
    if (!comment) return undefined;
    
    const updatedComment: BlogComment = {
      ...comment,
      isApproved: true
    };
    
    this.blogCommentsMap.set(id, updatedComment);
    return updatedComment;
  }

  async getBlogPostCommentCount(postId: number): Promise<number> {
    return Array.from(this.blogCommentsMap.values())
      .filter(comment => comment.postId === postId && comment.isApproved)
      .length;
  }

  // Chat operations
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessagesMap.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getChatMessage(id: number): Promise<ChatMessage | undefined> {
    return this.chatMessagesMap.get(id);
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const createdAt = new Date();
    
    const message: ChatMessage = {
      id,
      sessionId: messageData.sessionId,
      userId: messageData.userId || null,
      userName: messageData.userName || null,
      isAdmin: messageData.isAdmin || false,
      message: messageData.message,
      attachment: messageData.attachment || null,
      read: messageData.read || false,
      createdAt
    };
    
    this.chatMessagesMap.set(id, message);
    return message;
  }

  async markChatMessagesAsRead(sessionId: string): Promise<void> {
    const messages = Array.from(this.chatMessagesMap.values())
      .filter(message => message.sessionId === sessionId && !message.read);
    
    for (const message of messages) {
      const updatedMessage = { ...message, read: true };
      this.chatMessagesMap.set(message.id, updatedMessage);
    }
  }

  async getUnreadMessageCount(sessionId: string): Promise<number> {
    return Array.from(this.chatMessagesMap.values())
      .filter(message => message.sessionId === sessionId && !message.read)
      .length;
  }

  // Chat session operations
  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessionsMap.get(sessionId);
  }

  async createChatSession(sessionData: InsertChatSession): Promise<ChatSession> {
    const id = this.chatSessionsMap.size + 1;
    const createdAt = new Date();
    const lastActivity = new Date();
    
    const session: ChatSession = {
      id,
      sessionId: sessionData.sessionId,
      email: sessionData.email || null,
      status: sessionData.status || "active",
      lastActivity,
      createdAt
    };
    
    this.chatSessionsMap.set(sessionData.sessionId, session);
    return session;
  }

  async updateChatSessionActivity(sessionId: string): Promise<ChatSession | undefined> {
    const session = this.chatSessionsMap.get(sessionId);
    if (!session) return undefined;
    
    const updatedSession = { ...session, lastActivity: new Date() };
    this.chatSessionsMap.set(sessionId, updatedSession);
    return updatedSession;
  }

  async getActiveChatSessions(): Promise<ChatSession[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return Array.from(this.chatSessionsMap.values())
      .filter(session => session.status === "active" && session.lastActivity > fiveMinutesAgo)
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  // Auto response operations
  async getAutoResponses(): Promise<AutoResponse[]> {
    return Array.from(this.autoResponsesMap.values());
  }

  async getAutoResponse(id: number): Promise<AutoResponse | undefined> {
    return this.autoResponsesMap.get(id);
  }

  async createAutoResponse(data: InsertAutoResponse): Promise<AutoResponse> {
    const id = this.autoResponseIdCounter++;
    
    const autoResponse: AutoResponse = {
      id,
      keyword: data.keyword,
      response: data.response,
      active: data.active ?? true
    };
    
    this.autoResponsesMap.set(id, autoResponse);
    return autoResponse;
  }

  async findAutoResponseByKeyword(message: string): Promise<AutoResponse | undefined> {
    const lowerMessage = message.toLowerCase();
    return Array.from(this.autoResponsesMap.values())
      .find(ar => ar.active && lowerMessage.includes(ar.keyword.toLowerCase()));
  }
}

export const storage = new MemStorage();
