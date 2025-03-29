import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z, ZodError } from "zod";
import path from "path";
import fs from "fs";
import { createOrder, captureOrder, getOrder } from "./paypal";
import { setupChatServer } from "./chat";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/login, /api/register, etc.)
  setupAuth(app);

  // Get all projects
  app.get("/api/projects", async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get a single project by ID
  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Get featured projects
  app.get("/api/featured-projects", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const featuredProjects = await storage.getFeaturedProjects(limit);
      res.json(featuredProjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured projects" });
    }
  });

  // Get projects by category
  app.get("/api/categories/:id/projects", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const projects = await storage.getProjectsByCategory(categoryId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects for this category" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get single category
  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const category = await storage.getCategory(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get testimonials
  app.get("/api/testimonials", async (_req: Request, res: Response) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Create new order
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      // توجد هذه الميزة لجميع المستخدمين حتى الغير مسجلين
      // يمكن للجميع التحميل بدون الحاجة لتسجيل الدخول
      
      const orderSchema = z.object({
        projectId: z.number(),
        price: z.number().positive(),
        discountApplied: z.boolean().optional(),
        finalPrice: z.number().positive(),
        paymentMethod: z.string(),
        paymentReference: z.string().optional(),
        couponCode: z.string().optional()
      });

      const validatedData = orderSchema.parse(req.body);

      // Check if project exists
      const project = await storage.getProject(validatedData.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // تعيين معرف المستخدم
      // إذا كان المستخدم مسجل دخول، استخدم معرفه، وإلا استخدم معرف زائر
      const userId = req.isAuthenticated() ? req.user.id : 0; // استخدام 0 للزائرين

      // Apply coupon if provided
      if (validatedData.couponCode) {
        const couponResult = await storage.validateCoupon(validatedData.couponCode, userId);
        if (!couponResult.valid) {
          return res.status(400).json({ message: couponResult.message });
        }

        // Get the coupon
        const coupon = await storage.getCoupon(validatedData.couponCode);
        if (!coupon) {
          return res.status(400).json({ message: "Invalid coupon" });
        }

        // Create the order
        const order = await storage.createOrder({
          userId: userId,
          projectId: validatedData.projectId,
          price: project.price,
          discountApplied: true,
          finalPrice: validatedData.finalPrice,
          paymentMethod: validatedData.paymentMethod,
          paymentReference: validatedData.paymentReference,
          status: "completed"
        });

        // Record coupon usage for registered users only
        if (req.isAuthenticated()) {
          await storage.useCoupon({
            couponId: coupon.id,
            userId: userId,
            orderId: order.id
          });
        }

        return res.status(201).json(order);
      }

      // Create order without coupon
      const order = await storage.createOrder({
        userId: userId,
        projectId: validatedData.projectId,
        price: project.price,
        discountApplied: false,
        finalPrice: project.price,
        paymentMethod: validatedData.paymentMethod,
        paymentReference: validatedData.paymentReference,
        status: "completed"
      });

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get user orders
  app.get("/api/user/orders", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view your orders" });
      }

      const orders = await storage.getOrders(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Validate coupon
  app.post("/api/validate-coupon", async (req: Request, res: Response) => {
    try {
      // السماح للزوار (غير المسجلين) باستخدام الكوبونات
      const userId = req.isAuthenticated() ? req.user.id : 0; // استخدام 0 للزائرين

      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Coupon code is required" });
      }

      const result = await storage.validateCoupon(code, userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to validate coupon" });
    }
  });
  
  // ===== PayPal API Routes =====
  
  // إنشاء طلب دفع عبر PayPal
  app.post("/api/paypal/create-order", async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ 
          message: "Invalid amount. Please provide a positive number."
        });
      }
      
      const order = await createOrder(amount);
      res.json(order);
    } catch (error) {
      console.error("PayPal create order error:", error);
      res.status(500).json({ 
        message: "Failed to create PayPal order",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // إكمال عملية الدفع بعد قبول المستخدم
  app.post("/api/paypal/capture-order", async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      
      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
      }
      
      const captureData = await captureOrder(orderId);
      res.json(captureData);
    } catch (error) {
      console.error("PayPal capture order error:", error);
      res.status(500).json({ 
        message: "Failed to capture PayPal order",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // الحصول على تفاصيل طلب
  app.get("/api/paypal/order/:orderId", async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      
      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
      }
      
      const orderDetails = await getOrder(orderId);
      res.json(orderDetails);
    } catch (error) {
      console.error("PayPal get order error:", error);
      res.status(500).json({ 
        message: "Failed to get PayPal order details",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Search projects
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const results = await storage.searchProjects(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search projects" });
    }
  });

  // Project download route
  app.get("/api/download/:id", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      // Get project details
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // في الإصدار الجديد، لا نتحقق من الطلبات والمشتريات
      // نسمح للجميع بتنزيل المشاريع

      // تحديد اسم الملف بناءً على معرف المشروع
      const fileName = `project-${projectId}.zip`;
      const filePath = path.join(process.cwd(), 'public', 'downloads', fileName);

      // التحقق مما إذا كان الملف موجودًا بالفعل
      if (!fs.existsSync(filePath)) {
        // إذا لم يكن الملف موجودًا، قم بإنشاء ملف وهمي للاختبار
        // في التطبيق الحقيقي، يجب أن يكون الملف موجودًا مسبقًا
        fs.writeFileSync(filePath, 'This is a placeholder file for project download testing.');
      }

      // إرسال الملف للتنزيل
      res.download(filePath, `${project.title.replace(/\s+/g, '-').toLowerCase()}.zip`, (err) => {
        if (err) {
          console.error('Download error:', err);
          return res.status(500).json({ message: "Error downloading file" });
        }
      });
    } catch (error) {
      console.error('Download route error:', error);
      res.status(500).json({ message: "Failed to download project" });
    }
  });

  // Analytics API endpoints
  
  // Track user events
  app.post("/api/analytics/track", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to track events" });
      }

      const analyticsSchema = z.object({
        event: z.string(),
        page: z.string(),
        metadata: z.string().optional()
      });

      const validatedData = analyticsSchema.parse(req.body);
      
      const result = await storage.trackEvent({
        userId: req.user.id,
        event: validatedData.event,
        page: validatedData.page,
        metadata: validatedData.metadata || "{}"
      });
      
      res.status(201).json({ success: true, id: result.id });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid analytics data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to track analytics event" });
    }
  });
  
  // Get user analytics (requires auth and admin role)
  app.get("/api/analytics/user/:userId", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Admin authorization check (could be more sophisticated)
      if (req.user.id !== 1) { // Assuming id=1 is the admin for simplicity
        return res.status(403).json({ message: "Admin access required" });
      }

      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const analytics = await storage.getUserAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user analytics" });
    }
  });
  
  // Get analytics by event type (requires auth and admin role)
  app.get("/api/analytics/events/:eventType", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Admin authorization check
      if (req.user.id !== 1) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const eventType = req.params.eventType;
      if (!eventType) {
        return res.status(400).json({ message: "Event type is required" });
      }

      const analytics = await storage.getEventsByType(eventType);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event analytics" });
    }
  });
  
  // Get page view statistics (requires auth and admin role)
  app.get("/api/analytics/page-views", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Admin authorization check
      if (req.user.id !== 1) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const pageViewStats = await storage.getPageViewStats();
      res.json(pageViewStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page view statistics" });
    }
  });
  
  // Get recent analytics events (requires auth and admin role)
  app.get("/api/analytics/recent", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Admin authorization check
      if (req.user.id !== 1) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const analytics = await storage.getRecentAnalytics(limit);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent analytics" });
    }
  });

  // Blog API Routes
  
  // Get blog categories
  app.get("/api/blog/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      res.status(500).json({ message: "Failed to fetch blog categories" });
    }
  });

  // Get blog category by ID
  app.get("/api/blog/categories/:id", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const category = await storage.getBlogCategory(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Error fetching blog category:", error);
      res.status(500).json({ message: "Failed to fetch blog category" });
    }
  });

  // Get blog category by slug
  app.get("/api/blog/categories/slug/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      const category = await storage.getBlogCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Error fetching blog category by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog category" });
    }
  });

  // Get blog posts (with optional filtering)
  app.get("/api/blog/posts", async (req: Request, res: Response) => {
    try {
      const options: { limit?: number; categoryId?: number; tag?: string } = {};
      
      if (req.query.limit) {
        options.limit = parseInt(req.query.limit as string);
      }
      
      if (req.query.categoryId) {
        options.categoryId = parseInt(req.query.categoryId as string);
      }
      
      if (req.query.tag) {
        options.tag = req.query.tag as string;
      }
      
      const posts = await storage.getBlogPosts(options);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get featured blog posts
  app.get("/api/blog/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const featuredPosts = await storage.getFeaturedBlogPosts(limit);
      res.json(featuredPosts);
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      res.status(500).json({ message: "Failed to fetch featured blog posts" });
    }
  });

  // Get blog post by ID
  app.get("/api/blog/posts/:id", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getBlogPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Increment view count
      await storage.incrementBlogPostView(postId);
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Get blog post by slug
  app.get("/api/blog/posts/slug/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Increment view count
      await storage.incrementBlogPostView(post.id);
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Get related blog posts
  app.get("/api/blog/posts/:id/related", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const relatedPosts = await storage.getRelatedBlogPosts(postId, limit);
      
      res.json(relatedPosts);
    } catch (error) {
      console.error("Error fetching related blog posts:", error);
      res.status(500).json({ message: "Failed to fetch related blog posts" });
    }
  });

  // Search blog posts
  app.get("/api/blog/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const searchResults = await storage.searchBlogPosts(query);
      res.json(searchResults);
    } catch (error) {
      console.error("Error searching blog posts:", error);
      res.status(500).json({ message: "Failed to search blog posts" });
    }
  });

  // Get blog comments for a post
  app.get("/api/blog/posts/:id/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const comments = await storage.getBlogComments(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching blog comments:", error);
      res.status(500).json({ message: "Failed to fetch blog comments" });
    }
  });

  // Create a blog comment
  app.post("/api/blog/comments", async (req: Request, res: Response) => {
    try {
      // Auto-approve comments for demo purposes
      const commentData = { ...req.body, isApproved: true };
      
      const newComment = await storage.createBlogComment(commentData);
      res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating blog comment:", error);
      res.status(500).json({ message: "Failed to create blog comment" });
    }
  });

  // Chat API Endpoints
  
  // Get chat messages for a session
  app.get("/api/chat/messages/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      // Check if chat session exists, if not create one
      let session = await storage.getChatSession(sessionId);
      if (!session) {
        session = await storage.createChatSession({ sessionId });
      } else {
        // Update session activity
        await storage.updateChatSessionActivity(sessionId);
      }
      
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });
  
  // Create a new chat message
  app.post("/api/chat/messages", async (req: Request, res: Response) => {
    try {
      const messageSchema = z.object({
        sessionId: z.string(),
        message: z.string(),
        userName: z.string().optional(),
        email: z.string().email().optional(),
        attachment: z.string().optional()
      });
      
      const validatedData = messageSchema.parse(req.body);
      
      // Check if user is authenticated
      const userId = req.isAuthenticated() ? req.user.id : null;
      
      // First, check if chat session exists, if not create one
      let session = await storage.getChatSession(validatedData.sessionId);
      if (!session) {
        session = await storage.createChatSession({ 
          sessionId: validatedData.sessionId,
          email: validatedData.email || null
        });
      } else {
        // Update session activity
        await storage.updateChatSessionActivity(validatedData.sessionId);
      }
      
      // Create the message
      const newMessage = await storage.createChatMessage({
        sessionId: validatedData.sessionId,
        userId,
        userName: validatedData.userName || null,
        isAdmin: false,
        message: validatedData.message,
        attachment: validatedData.attachment || null,
        read: false
      });
      
      // Try to find auto-response
      const autoResponse = await storage.findAutoResponseByKeyword(validatedData.message);
      
      let responseMessage = null;
      if (autoResponse) {
        // Create auto-response message
        responseMessage = await storage.createChatMessage({
          sessionId: validatedData.sessionId,
          isAdmin: true,
          message: autoResponse.response,
          read: false
        });
      }
      
      res.status(201).json({
        message: newMessage,
        autoResponse: responseMessage
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.format() });
      }
      console.error("Error creating chat message:", error);
      res.status(500).json({ message: "Failed to create chat message" });
    }
  });
  
  // Mark messages as read
  app.post("/api/chat/mark-read/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      await storage.markChatMessagesAsRead(sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  });
  
  // Get active chat sessions (for admin)
  app.get("/api/chat/sessions", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Admin authorization check
      if (req.user.id !== 1) { // Assuming id=1 is the admin for simplicity
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const sessions = await storage.getActiveChatSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });
  
  // Get unread message count for a session
  app.get("/api/chat/unread/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      const count = await storage.getUnreadMessageCount(sessionId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread message count" });
    }
  });

  // Setup server
  const httpServer = createServer(app);
  
  // Setup chat server using Socket.IO
  setupChatServer(httpServer);
  console.log("Chat server initialized successfully");

  return httpServer;
}