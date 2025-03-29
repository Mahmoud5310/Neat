import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

// أنواع البيانات
export interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  senderType: "user" | "admin" | "bot";
  name?: string;
  email?: string;
  fileUrl?: string;
  fileType?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  unread: number;
  userInfo: {
    name?: string;
    email?: string;
  };
  createdAt: number;
  isActive: boolean;
}

// الردود التلقائية
const autoResponses: { pattern: RegExp; response: string }[] = [
  { 
    pattern: /مرحبا|أهلا|السلام عليكم|hi|hello/i, 
    response: "مرحباً! كيف يمكنني مساعدتك اليوم؟" 
  },
  { 
    pattern: /سعر|أسعار|price|cost/i, 
    response: "يمكنك الاطلاع على أسعار منتجاتنا في صفحة المنتجات. هل تريد مساعدة في العثور على منتج معين؟" 
  },
  { 
    pattern: /دفع|فودافون|باي بال|payment|vodafone|paypal/i, 
    response: "نحن نقبل طرق الدفع عبر فودافون كاش وباي بال. هل تواجه مشكلة في إتمام عملية الدفع؟" 
  },
  { 
    pattern: /تحميل|download/i, 
    response: "يمكنك تحميل المشاريع المشتراة من صفحة حسابك. إذا كنت تواجه مشكلة، يرجى توضيح ذلك." 
  },
  { 
    pattern: /مشكلة|خطأ|error|problem|issue/i, 
    response: "آسف لسماع ذلك. يرجى وصف المشكلة بمزيد من التفاصيل وسنقوم بمساعدتك في أقرب وقت ممكن." 
  },
  { 
    pattern: /شكرا|thank/i, 
    response: "شكراً لتواصلك معنا! هل هناك شيء آخر يمكننا مساعدتك به؟" 
  }
];

// التحقق من الردود التلقائية
function getAutoResponse(message: string): string | null {
  for (const response of autoResponses) {
    if (response.pattern.test(message)) {
      return response.response;
    }
  }
  return null;
}

export function setupChatServer(httpServer: HttpServer) {
  // إعداد قاعدة بيانات مؤقتة للدردشات
  const activeSessions = new Map<string, ChatSession>();
  const userSocketMap = new Map<string, Socket>();
  const adminSocketMap = new Map<string, Socket>();
  
  // إنشاء خادم Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  // معالجة اتصالات المستخدمين
  io.on("connection", (socket: Socket) => {
    console.log("New connection:", socket.id);
    
    // المستخدم العادي يتصل
    socket.on("user:connect", (userData: { name?: string; email?: string }) => {
      const userId = uuidv4();
      socket.data.userId = userId;
      socket.data.isAdmin = false;
      userSocketMap.set(userId, socket);
      
      // إنشاء جلسة دردشة جديدة
      const newSession: ChatSession = {
        id: uuidv4(),
        userId,
        messages: [],
        unread: 0,
        userInfo: {
          name: userData.name || "زائر",
          email: userData.email
        },
        createdAt: Date.now(),
        isActive: true
      };
      
      activeSessions.set(newSession.id, newSession);
      socket.data.sessionId = newSession.id;
      
      // إرسال رسالة ترحيب تلقائية
      const welcomeMessage: Message = {
        id: uuidv4(),
        userId: "system",
        text: "مرحباً بك في الدردشة المباشرة! كيف يمكنني مساعدتك اليوم؟",
        timestamp: Date.now(),
        senderType: "bot"
      };
      
      newSession.messages.push(welcomeMessage);
      socket.emit("message:new", welcomeMessage);
      
      // إشعار المسؤولين بإنشاء جلسة جديدة
      io.to("admin").emit("session:new", {
        id: newSession.id,
        userInfo: newSession.userInfo,
        createdAt: newSession.createdAt,
        unread: 1
      });
      
      console.log(`User connected: ${userId}, Session: ${newSession.id}`);
    });
    
    // المسؤول يتصل
    socket.on("admin:connect", (adminId: string) => {
      socket.data.adminId = adminId;
      socket.data.isAdmin = true;
      adminSocketMap.set(adminId, socket);
      socket.join("admin");
      
      // إرسال قائمة الجلسات النشطة للمسؤول
      const sessionList = Array.from(activeSessions.values()).map(session => ({
        id: session.id,
        userInfo: session.userInfo,
        createdAt: session.createdAt,
        lastMessage: session.messages.length > 0 ? session.messages[session.messages.length - 1] : null,
        unread: session.unread
      }));
      
      socket.emit("session:list", sessionList);
      console.log(`Admin connected: ${adminId}`);
    });
    
    // اختيار المسؤول لجلسة محددة
    socket.on("session:select", (sessionId: string) => {
      if (socket.data.isAdmin && activeSessions.has(sessionId)) {
        socket.join(sessionId);
        const session = activeSessions.get(sessionId);
        socket.emit("session:history", session?.messages);
        
        // إعادة تعيين عدد الرسائل غير المقروءة
        if (session) {
          session.unread = 0;
          io.to("admin").emit("session:update", {
            id: sessionId,
            unread: 0
          });
        }
      }
    });
    
    // استلام رسالة جديدة
    socket.on("message:send", (data: { text: string; fileUrl?: string; fileType?: string }) => {
      const isAdmin = socket.data.isAdmin;
      const userId = socket.data.userId || socket.data.adminId;
      const sessionId = isAdmin ? socket.data.currentSessionId : socket.data.sessionId;
      
      if (!sessionId || !userId || !activeSessions.has(sessionId)) {
        socket.emit("error", { message: "جلسة غير صالحة" });
        return;
      }
      
      const session = activeSessions.get(sessionId)!;
      
      // إنشاء رسالة جديدة
      const newMessage: Message = {
        id: uuidv4(),
        userId,
        text: data.text,
        timestamp: Date.now(),
        senderType: isAdmin ? "admin" : "user",
        fileUrl: data.fileUrl,
        fileType: data.fileType
      };
      
      // إضافة الرسالة إلى الجلسة
      session.messages.push(newMessage);
      
      // إذا كانت رسالة من المستخدم، زيادة عدد الرسائل غير المقروءة للمسؤول
      if (!isAdmin) {
        session.unread += 1;
        
        // إرسال الرسالة إلى جميع المسؤولين
        io.to("admin").emit("message:new", {
          sessionId,
          message: newMessage
        });
        
        io.to("admin").emit("session:update", {
          id: sessionId,
          unread: session.unread
        });
        
        // التحقق من الرد التلقائي
        const autoResponse = getAutoResponse(data.text);
        if (autoResponse) {
          setTimeout(() => {
            const botMessage: Message = {
              id: uuidv4(),
              userId: "system",
              text: autoResponse,
              timestamp: Date.now(),
              senderType: "bot"
            };
            
            session.messages.push(botMessage);
            socket.emit("message:new", botMessage);
            
            io.to("admin").emit("message:new", {
              sessionId,
              message: botMessage
            });
          }, 1000); // تأخير الرد التلقائي قليلاً للواقعية
        }
      } else {
        // إرسال الرسالة إلى المستخدم
        const userSocket = userSocketMap.get(session.userId);
        if (userSocket && userSocket.connected) {
          userSocket.emit("message:new", newMessage);
        }
      }
      
      // إرسال الرسالة للجلسة
      socket.emit("message:new", newMessage);
    });
    
    // تحميل ملف
    socket.on("file:upload", (data: { fileName: string; fileData: string; fileType: string }) => {
      // في هذه الإصدارة المبسطة، نقوم فقط بإعادة الملف للمستخدم
      // في التطبيق الحقيقي، سيتم تخزين الملف على الخادم
      const fileUrl = data.fileData; // هذا عادة ما سيكون URL للملف المخزن
      socket.emit("file:uploaded", { fileUrl, fileType: data.fileType });
    });
    
    // إغلاق جلسة
    socket.on("session:close", (sessionId: string) => {
      if (socket.data.isAdmin && activeSessions.has(sessionId)) {
        const session = activeSessions.get(sessionId)!;
        session.isActive = false;
        
        const userSocket = userSocketMap.get(session.userId);
        if (userSocket && userSocket.connected) {
          userSocket.emit("session:closed");
        }
        
        io.to("admin").emit("session:update", {
          id: sessionId,
          isActive: false
        });
      }
    });
    
    // قطع الاتصال
    socket.on("disconnect", () => {
      const userId = socket.data.userId;
      const adminId = socket.data.adminId;
      
      if (userId) {
        userSocketMap.delete(userId);
        // لا نقوم بإزالة الجلسة، فقط نعلمها كغير نشطة بعد وقت معين
        setTimeout(() => {
          const sessionId = socket.data.sessionId;
          if (sessionId && activeSessions.has(sessionId)) {
            const session = activeSessions.get(sessionId)!;
            if (!userSocketMap.has(userId)) {
              session.isActive = false;
              io.to("admin").emit("session:update", {
                id: sessionId,
                isActive: false
              });
            }
          }
        }, 30000); // 30 ثانية قبل اعتبار الجلسة غير نشطة
      }
      
      if (adminId) {
        adminSocketMap.delete(adminId);
        socket.leave("admin");
      }
      
      console.log("Client disconnected:", socket.id);
    });
  });
  
  return io;
}