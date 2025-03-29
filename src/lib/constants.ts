// Project related constants
export const PROJECT_CATEGORIES = [
  { id: 1, name: "E-commerce", nameAr: "متاجر إلكترونية", icon: "fa-store", count: 12 },
  { id: 2, name: "Mobile Apps", nameAr: "تطبيقات الجوال", icon: "fa-mobile-alt", count: 8 },
  { id: 3, name: "Productivity", nameAr: "الإنتاجية", icon: "fa-tasks", count: 15 },
  { id: 4, name: "Analytics", nameAr: "التحليلات", icon: "fa-chart-line", count: 6 }
];

// Payment Methods
export const PAYMENT_METHODS = [
  { id: "vodafone_cash", name: "Vodafone Cash", nameAr: "فودافون كاش", icon: "fa-money-bill" },
  { id: "paypal", name: "PayPal", nameAr: "باي بال", icon: "fa-paypal" }
];

// Order Status
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

// Paths
export const PATHS = {
  HOME: "/",
  AUTH: "/auth",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: number | string) => `/products/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ACCOUNT: "/account",
  ABOUT: "/about",
  CONTACT: "/contact",
  DOWNLOAD: (id: number | string) => `/download/${id}`,
  BLOG: "/blog",
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  FAQ: "/faq"
};

// Translations
export const TRANSLATIONS = {
  en: {
    common: {
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact",
      login: "Login",
      register: "Register",
      logout: "Logout",
      myAccount: "My Account",
      myPurchases: "My Purchases",
      settings: "Settings",
      cart: "Cart",
      search: "Search",
      viewDetails: "View Details",
      buyNow: "Buy Now",
      addToCart: "Add to Cart",
      download: "Download",
      price: "Price",
      discountedPrice: "Discounted Price",
      loading: "Loading...",
      error: "An error occurred",
      notFound: "Not Found",
      viewAll: "View All",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      total: "Total",
      checkout: "Checkout"
    },
    home: {
      hero: {
        title: "Premium Coding Projects Ready to Launch",
        description: "Get high-quality code projects instantly. Pay once, download instantly, and launch your idea today.",
        browseProjects: "Browse Projects",
        learnMore: "Learn More"
      },
      featured: {
        title: "Featured Projects",
        description: "Browse our collection of high-quality, ready-to-use programming projects"
      },
      categories: {
        title: "Browse by Category",
        description: "Find the perfect project for your specific needs"
      },
      spotlight: {
        title: "Featured Project Spotlight",
        description: "Take a closer look at one of our best-selling projects"
      },
      testimonials: {
        title: "What Our Customers Say",
        description: "Read testimonials from developers who have used our projects"
      },
      howItWorks: {
        title: "How It Works",
        description: "Simple steps to purchase and use our programming projects",
        steps: [
          {
            title: "Browse Projects",
            description: "Explore our collection of high-quality programming projects."
          },
          {
            title: "Purchase",
            description: "Securely pay using Vodafone Cash payment system."
          },
          {
            title: "Download",
            description: "Get instant access to your purchased project files."
          },
          {
            title: "Launch",
            description: "Follow our documentation to deploy your new project."
          }
        ]
      },
      newsletter: {
        title: "Get 20% Off Your First Purchase",
        description: "Subscribe to our newsletter for exclusive deals and updates on new projects",
        placeholder: "Your email address",
        button: "Subscribe",
        terms: "By subscribing, you agree to our Privacy Policy and Terms of Service."
      }
    },
    products: {
      title: "All Projects",
      description: "Browse our complete collection of programming projects",
      filter: "Filter by category",
      sort: "Sort by",
      search: "Search projects",
      noResults: "No projects found matching your criteria",
      items: "projects"
    },
    productDetail: {
      relatedProjects: "Related Projects",
      features: "Features",
      technologies: "Technologies",
      specifications: "Specifications",
      reviews: "Reviews",
      leaveReview: "Leave a Review",
      viewDemo: "View Demo",
      downloadSample: "Download Sample"
    },
    auth: {
      loginTitle: "Login to Your Account",
      registerTitle: "Create a New Account",
      usernameLabel: "Username",
      emailLabel: "Email",
      passwordLabel: "Password",
      fullNameLabel: "Full Name",
      forgotPassword: "Forgot your password?",
      noAccount: "Don't have an account?",
      alreadyAccount: "Already have an account?",
      signUp: "Sign up",
      signIn: "Sign in",
      orContinueWith: "Or continue with",
      google: "Google",
      secureLogin: "Secure login with strong encryption",
      loginSuccess: "Login successful!",
      registerSuccess: "Registration successful!",
      error: "An error occurred"
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      startShopping: "Start Shopping",
      summary: "Order Summary",
      subtotal: "Subtotal",
      discount: "Discount",
      total: "Total",
      coupon: "Coupon Code",
      applyCoupon: "Apply",
      checkout: "Proceed to Checkout",
      continueShopping: "Continue Shopping",
      items: "items",
      remove: "Remove"
    },
    checkout: {
      title: "Checkout",
      orderSummary: "Order Summary",
      paymentMethod: "Payment Method",
      paymentDetails: "Payment Details",
      phoneNumber: "Phone Number",
      transactionId: "Transaction ID (Optional)",
      instructions: "Payment Instructions",
      vodafoneInstructions: "Please contact our payment service to complete your purchase and receive your download link.",
      contactNumber: "Contact Number",
      downloadNote: "After payment confirmation, you will receive instructions to download your project.",
      placeOrder: "Place Order",
      paymentSuccess: "Payment Successful",
      downloadInstructions: "Your order has been processed. You can now download your project from your account page.",
      processing: "Processing",
      verifyingOrder: "Verifying your order, please wait...",
      loginRequired: "Login required to complete your purchase",
      orderProcessingFailed: "There was an error processing your order. Please try again."
    },
    account: {
      title: "My Account",
      manageYourAccount: "Manage Your Account",
      purchases: "My Purchases",
      profile: "Profile",
      noPurchases: "You haven't made any purchases yet",
      noPurchasesMessage: "Browse our projects and make your first purchase",
      browseProjects: "Browse Projects",
      download: "Download",
      downloadPage: "Download Page",
      downloadAgain: "Download Again",
      orderDate: "Order Date",
      orderDetails: "Order Details",
      projectName: "Project Name",
      orderTotal: "Order Total",
      orderStatus: "Status",
      actions: "Actions",
      personalInfo: "Personal Information",
      updatePersonalInfo: "Update your personal details",
      changePassword: "Change Password",
      passwordRequirements: "Password must be at least 6 characters",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updateProfile: "Update Profile",
      updatePassword: "Update Password",
      updateSuccess: "Profile updated successfully",
      status: {
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        cancelled: "Cancelled"
      }
    },
    download: {
      thankYou: "Thank you, {name}!",
      ready: "Your download is ready",
      fileSize: "File Size",
      fileFormat: "File Format",
      releaseDate: "Release Date",
      version: "Version",
      downloadNow: "Download Now",
      downloading: "Downloading...",
      copyLink: "Copy Link",
      copied: "Link Copied",
      success: "Download Started",
      startingSoon: "Your download should start automatically",
      failed: "Download Failed",
      tryAgain: "Please try again later",
      linkCopied: "Link Copied!",
      linkCopiedMessage: "Download link copied to clipboard",
      copyFailed: "Copy Failed",
      copyFailedMessage: "Could not copy link to clipboard",
      supportMessage: "Having issues with your download?",
      contactSupport: "Contact Support",
      unauthorized: "Unauthorized Access",
      purchaseRequired: "You must purchase this project before downloading",
      loginRequired: "Login Required",
      loginMessage: "Please login to download this project"
    },
    blog: {
      title: "Blog",
      description: "Latest news, tutorials, and updates from our team",
      allPosts: "All Posts",
      searchPlaceholder: "Search articles...",
      categoriesError: "Error loading categories",
      postsError: "Error loading posts",
      noPosts: "No posts found in this category",
      noSearchResults: "No posts matching your search",
      clearSearch: "Clear search",
      readMore: "Read More",
      comments: "Comments",
      leaveComment: "Leave a Comment",
      commentAsUser: "Commenting as {name}",
      commentAsGuest: "Commenting as a guest",
      yourName: "Your Name",
      yourEmail: "Your Email",
      yourComment: "Your Comment",
      namePlaceholder: "Enter your name",
      emailPlaceholder: "Enter your email",
      commentPlaceholder: "Write your comment here...",
      submitComment: "Submit Comment",
      commentSuccess: "Comment Submitted",
      commentSuccessMessage: "Your comment has been submitted successfully",
      commentError: "Error Submitting Comment",
      noComments: "No comments yet. Be the first to comment!",
      likeComment: "Like",
      share: "Share",
      postNotFound: "Post Not Found",
      postNotFoundMessage: "The post you're looking for doesn't exist or has been removed",
      backToBlog: "Back to Blog",
      relatedPosts: "Related Posts"
    },
    FAQ: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about our services and products",
      searchPlaceholder: "Search for questions...",
      allCategories: "All Categories",
      category: "Category",
      noResults: "No results found for your search",
      clearSearch: "Clear search and see all questions"
    },
    chat: {
      title: "Live Chat",
      chatWithUs: "Chat with us",
      typePlaceholder: "Type your message...",
      send: "Send",
      attachFile: "Attach file",
      welcomeMessage: "Start chatting with us! We're here to help.",
      connecting: "Connecting to chat server...",
      fileTooBig: "File is too large. Maximum size is 5MB.",
      sentFile: "Sent file",
      guest: "Guest",
      sentAFile: "Sent a file"
    }
  },
  ar: {
    common: {
      home: "الرئيسية",
      products: "المنتجات",
      about: "من نحن",
      contact: "اتصل بنا",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      logout: "تسجيل الخروج",
      myAccount: "حسابي",
      myPurchases: "مشترياتي",
      settings: "الإعدادات",
      cart: "السلة",
      search: "بحث",
      viewDetails: "عرض التفاصيل",
      buyNow: "اشتر الآن",
      addToCart: "أضف للسلة",
      download: "تحميل",
      price: "السعر",
      discountedPrice: "السعر بعد الخصم",
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      notFound: "غير موجود",
      viewAll: "عرض الكل",
      submit: "إرسال",
      cancel: "إلغاء",
      save: "حفظ",
      edit: "تعديل",
      delete: "حذف",
      total: "الإجمالي",
      checkout: "إتمام الشراء"
    },
    home: {
      hero: {
        title: "مشاريع برمجية احترافية جاهزة للإطلاق",
        description: "احصل على مشاريع برمجية عالية الجودة فوراً. ادفع مرة واحدة، حمّل فوراً، وأطلق فكرتك اليوم.",
        browseProjects: "تصفح المشاريع",
        learnMore: "اعرف المزيد"
      },
      featured: {
        title: "المشاريع المميزة",
        description: "تصفح مجموعتنا من المشاريع البرمجية عالية الجودة والجاهزة للاستخدام"
      },
      categories: {
        title: "تصفح حسب الفئة",
        description: "اعثر على المشروع المثالي لاحتياجاتك المحددة"
      },
      spotlight: {
        title: "عرض المشروع المميز",
        description: "إلقاء نظرة فاحصة على أحد مشاريعنا الأكثر مبيعاً"
      },
      testimonials: {
        title: "ماذا يقول عملاؤنا",
        description: "اقرأ شهادات من المطورين الذين استخدموا مشاريعنا"
      },
      howItWorks: {
        title: "كيف يعمل",
        description: "خطوات بسيطة لشراء واستخدام مشاريعنا البرمجية",
        steps: [
          {
            title: "تصفح المشاريع",
            description: "استكشف مجموعتنا من مشاريع البرمجة عالية الجودة."
          },
          {
            title: "الشراء",
            description: "ادفع بأمان باستخدام نظام فودافون كاش."
          },
          {
            title: "التحميل",
            description: "احصل على وصول فوري لملفات المشروع التي اشتريتها."
          },
          {
            title: "الإطلاق",
            description: "اتبع وثائقنا لنشر مشروعك الجديد."
          }
        ]
      },
      newsletter: {
        title: "احصل على خصم 20% على مشتراك الأول",
        description: "اشترك في نشرتنا الإخبارية للحصول على صفقات حصرية وتحديثات حول المشاريع الجديدة",
        placeholder: "بريدك الإلكتروني",
        button: "اشترك",
        terms: "بالاشتراك، فإنك توافق على سياسة الخصوصية وشروط الخدمة."
      }
    },
    products: {
      title: "جميع المشاريع",
      description: "تصفح مجموعتنا الكاملة من المشاريع البرمجية",
      filter: "تصفية حسب الفئة",
      sort: "ترتيب حسب",
      search: "البحث عن مشاريع",
      noResults: "لم يتم العثور على مشاريع تطابق معايير البحث",
      items: "مشروع"
    },
    productDetail: {
      relatedProjects: "مشاريع ذات صلة",
      features: "المميزات",
      technologies: "التقنيات",
      specifications: "المواصفات",
      reviews: "التقييمات",
      leaveReview: "أضف تقييماً",
      viewDemo: "عرض تجريبي",
      downloadSample: "تحميل عينة"
    },
    auth: {
      loginTitle: "تسجيل الدخول إلى حسابك",
      registerTitle: "إنشاء حساب جديد",
      usernameLabel: "اسم المستخدم",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      fullNameLabel: "الاسم الكامل",
      forgotPassword: "نسيت كلمة المرور؟",
      noAccount: "ليس لديك حساب؟",
      alreadyAccount: "لديك حساب بالفعل؟",
      signUp: "إنشاء حساب",
      signIn: "تسجيل الدخول",
      orContinueWith: "أو تابع باستخدام",
      google: "جوجل",
      secureLogin: "تسجيل دخول آمن مع تشفير قوي",
      loginSuccess: "تم تسجيل الدخول بنجاح!",
      registerSuccess: "تم التسجيل بنجاح!",
      error: "حدث خطأ"
    },
    cart: {
      title: "سلة التسوق",
      empty: "سلة التسوق فارغة",
      startShopping: "ابدأ التسوق",
      summary: "ملخص الطلب",
      subtotal: "المجموع الفرعي",
      discount: "الخصم",
      total: "الإجمالي",
      coupon: "رمز القسيمة",
      applyCoupon: "تطبيق",
      checkout: "إتمام الشراء",
      continueShopping: "متابعة التسوق",
      items: "عنصر",
      remove: "إزالة"
    },
    checkout: {
      title: "إتمام الشراء",
      orderSummary: "ملخص الطلب",
      paymentMethod: "طريقة الدفع",
      paymentDetails: "تفاصيل الدفع",
      phoneNumber: "رقم الهاتف",
      transactionId: "رقم العملية (اختياري)",
      instructions: "تعليمات الدفع",
      vodafoneInstructions: "يرجى إرسال المبلغ إلى 01XXXXXXXX وتضمين رقم الطلب في ملاحظة المعاملة. بعد الدفع، أدخل رقم العملية أدناه.",
      placeOrder: "إتمام الطلب",
      paymentSuccess: "تم الدفع بنجاح",
      downloadInstructions: "تمت معالجة طلبك. يمكنك الآن تحميل مشروعك من صفحة حسابك."
    },
    account: {
      title: "حسابي",
      manageYourAccount: "إدارة حسابك",
      purchases: "مشترياتي",
      profile: "الملف الشخصي",
      noPurchases: "لم تقم بأي عمليات شراء بعد",
      noPurchasesMessage: "تصفح مشاريعنا وقم بعملية الشراء الأولى",
      browseProjects: "تصفح المشاريع",
      download: "تحميل",
      downloadPage: "صفحة التحميل",
      downloadAgain: "تحميل مرة أخرى",
      orderDate: "تاريخ الطلب",
      orderDetails: "تفاصيل الطلب",
      projectName: "اسم المشروع",
      orderTotal: "إجمالي الطلب",
      orderStatus: "الحالة",
      actions: "الإجراءات",
      personalInfo: "المعلومات الشخصية",
      updatePersonalInfo: "تحديث بياناتك الشخصية",
      changePassword: "تغيير كلمة المرور",
      passwordRequirements: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور الجديدة",
      updateProfile: "تحديث الملف الشخصي",
      updatePassword: "تحديث كلمة المرور",
      updateSuccess: "تم تحديث الملف الشخصي بنجاح",
      status: {
        pending: "قيد الانتظار",
        processing: "قيد المعالجة",
        completed: "مكتمل",
        cancelled: "ملغي"
      }
    },
    download: {
      thankYou: "شكراً لك، {name}!",
      ready: "ملفك جاهز للتنزيل",
      fileSize: "حجم الملف",
      fileFormat: "صيغة الملف",
      releaseDate: "تاريخ الإصدار",
      version: "الإصدار",
      downloadNow: "تنزيل الآن",
      downloading: "جارٍ التنزيل...",
      copyLink: "نسخ الرابط",
      copied: "تم نسخ الرابط",
      success: "بدأ التنزيل",
      startingSoon: "سيبدأ التنزيل تلقائياً",
      failed: "فشل التنزيل",
      tryAgain: "يرجى المحاولة مرة أخرى لاحقاً",
      linkCopied: "تم نسخ الرابط!",
      linkCopiedMessage: "تم نسخ رابط التنزيل إلى الحافظة",
      copyFailed: "فشل النسخ",
      copyFailedMessage: "تعذر نسخ الرابط إلى الحافظة",
      supportMessage: "هل تواجه مشكلة في التنزيل؟",
      contactSupport: "تواصل مع الدعم الفني",
      unauthorized: "وصول غير مصرح به",
      purchaseRequired: "يجب شراء هذا المشروع قبل تنزيله",
      loginRequired: "تسجيل الدخول مطلوب",
      loginMessage: "يرجى تسجيل الدخول لتنزيل هذا المشروع"
    },
    blog: {
      title: "المدونة",
      description: "آخر الأخبار والدروس والتحديثات من فريقنا",
      allPosts: "جميع المقالات",
      searchPlaceholder: "البحث في المقالات...",
      categoriesError: "خطأ في تحميل التصنيفات",
      postsError: "خطأ في تحميل المقالات",
      noPosts: "لا توجد مقالات في هذه الفئة",
      noSearchResults: "لا توجد مقالات تطابق بحثك",
      clearSearch: "مسح البحث",
      readMore: "اقرأ المزيد",
      comments: "التعليقات",
      leaveComment: "أضف تعليقاً",
      commentAsUser: "التعليق باسم {name}",
      commentAsGuest: "التعليق كضيف",
      yourName: "اسمك",
      yourEmail: "بريدك الإلكتروني",
      yourComment: "تعليقك",
      namePlaceholder: "أدخل اسمك",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      commentPlaceholder: "اكتب تعليقك هنا...",
      submitComment: "إرسال التعليق",
      commentSuccess: "تم إرسال التعليق",
      commentSuccessMessage: "تم إرسال تعليقك بنجاح",
      commentError: "خطأ في إرسال التعليق",
      noComments: "لا توجد تعليقات بعد. كن أول من يعلق!",
      likeComment: "إعجاب",
      share: "مشاركة",
      postNotFound: "المقال غير موجود",
      postNotFoundMessage: "المقال الذي تبحث عنه غير موجود أو تمت إزالته",
      backToBlog: "العودة إلى المدونة",
      relatedPosts: "مقالات ذات صلة"
    },
    FAQ: {
      title: "الأسئلة الشائعة",
      subtitle: "اعثر على إجابات للأسئلة الشائعة حول خدماتنا ومنتجاتنا",
      searchPlaceholder: "ابحث عن سؤال...",
      allCategories: "جميع الفئات",
      category: "الفئة",
      noResults: "لم يتم العثور على نتائج لبحثك",
      clearSearch: "مسح البحث وعرض جميع الأسئلة"
    },
    chat: {
      title: "محادثة مباشرة",
      chatWithUs: "تحدث معنا",
      typePlaceholder: "اكتب رسالتك...",
      send: "إرسال",
      attachFile: "إرفاق ملف",
      welcomeMessage: "ابدأ الدردشة معنا! نحن هنا للمساعدة.",
      connecting: "جارِ الاتصال بخادم الدردشة...",
      fileTooBig: "الملف كبير جدًا. الحد الأقصى 5 ميجابايت.",
      sentFile: "تم إرسال ملف",
      guest: "زائر",
      sentAFile: "تم إرسال ملف"
    }
  }
};
