import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  id: string;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
  category: string;
  categoryAr: string;
}

// الفئات والأسئلة الشائعة مع الإجابات
const faqItems: FAQItem[] = [
  {
    id: "purchase",
    question: "How do I purchase a project from the website?",
    questionAr: "كيف أقوم بشراء مشروع من الموقع؟",
    answer: "To purchase a project, browse our projects page, select the project you're interested in, click on 'Buy Now', and follow the checkout process. You'll need to create an account or log in if you don't already have one.",
    answerAr: "لشراء مشروع، تصفح صفحة المشاريع لدينا، واختر المشروع الذي تهتم به، وانقر على 'اشتر الآن'، واتبع عملية الدفع. ستحتاج إلى إنشاء حساب أو تسجيل الدخول إذا لم يكن لديك حساب بالفعل.",
    category: "Purchases",
    categoryAr: "المشتريات",
  },
  {
    id: "payment-methods",
    question: "What payment methods are available?",
    questionAr: "ما هي طرق الدفع المتاحة؟",
    answer: "We currently accept PayPal and Vodafone Cash for all transactions. We're working on adding more payment methods in the future. All transactions are secure and encrypted.",
    answerAr: "نقبل حاليًا PayPal وفودافون كاش لجميع المعاملات. نحن نعمل على إضافة المزيد من طرق الدفع في المستقبل. جميع المعاملات آمنة ومشفرة.",
    category: "Payments",
    categoryAr: "المدفوعات",
  },
  {
    id: "refund",
    question: "Can I get a refund after purchase?",
    questionAr: "هل يمكنني استرداد الأموال بعد الشراء؟",
    answer: "Yes, we offer a 30-day money-back guarantee on all purchases if you're not satisfied with the product. To request a refund, please contact our support team with your order details.",
    answerAr: "نعم، نقدم ضمان استرداد الأموال لمدة 30 يومًا على جميع المشتريات إذا لم تكن راضيًا عن المنتج. لطلب استرداد الأموال، يرجى الاتصال بفريق الدعم الخاص بنا مع تفاصيل طلبك.",
    category: "Refunds",
    categoryAr: "استرداد الأموال",
  },
  {
    id: "updates",
    question: "How do I get project updates after purchasing?",
    questionAr: "كيف أحصل على تحديثات المشروع بعد شرائه؟",
    answer: "After purchasing a project, you'll have access to all future updates through your account dashboard. We'll also notify you via email when updates are available. Simply log in to your account, go to 'My Purchases', and download the latest version.",
    answerAr: "بعد شراء مشروع، ستتمكن من الوصول إلى جميع التحديثات المستقبلية من خلال لوحة تحكم حسابك. سنقوم أيضًا بإعلامك عبر البريد الإلكتروني عند توفر التحديثات. ما عليك سوى تسجيل الدخول إلى حسابك، والانتقال إلى 'مشترياتي'، وتنزيل أحدث إصدار.",
    category: "Updates",
    categoryAr: "التحديثات",
  },
  {
    id: "technical-support",
    question: "How can I contact technical support?",
    questionAr: "كيف يمكنني التواصل مع الدعم الفني؟",
    answer: "You can contact our technical support team through multiple channels: use the live chat feature on our website, send an email to support@neat.com, or fill out the contact form on our Contact page. Our support team is available 24/7 to assist you.",
    answerAr: "يمكنك الاتصال بفريق الدعم الفني لدينا من خلال قنوات متعددة: استخدم ميزة الدردشة المباشرة على موقعنا، أو أرسل بريدًا إلكترونيًا إلى support@neat.com، أو املأ نموذج الاتصال في صفحة الاتصال لدينا. فريق الدعم لدينا متاح على مدار الساعة لمساعدتك.",
    category: "Support",
    categoryAr: "الدعم",
  },
  {
    id: "source-code",
    question: "Do I get the source code with my purchase?",
    questionAr: "هل أحصل على الكود المصدري مع مشترياتي؟",
    answer: "Yes, all projects come with full source code. You'll receive access to the complete codebase, allowing you to customize and modify the project according to your needs. The source code is well-documented to help you understand and make changes easily.",
    answerAr: "نعم، جميع المشاريع تأتي مع الكود المصدري الكامل. ستحصل على حق الوصول إلى قاعدة الشفرة الكاملة، مما يتيح لك تخصيص وتعديل المشروع وفقًا لاحتياجاتك. الكود المصدري موثق جيدًا لمساعدتك على الفهم وإجراء التغييرات بسهولة.",
    category: "Products",
    categoryAr: "المنتجات",
  },
  {
    id: "license",
    question: "What is the license for purchased projects?",
    questionAr: "ما هي رخصة المشاريع المشتراة؟",
    answer: "Each purchased project comes with a single-use license, which means you can use it for one implementation (either for yourself or a client). If you need to use the same project for multiple implementations, you'll need to purchase additional licenses. For more details, please refer to our License Agreement page.",
    answerAr: "يأتي كل مشروع تم شراؤه مع ترخيص استخدام واحد، مما يعني أنه يمكنك استخدامه لتطبيق واحد (إما لنفسك أو لعميل). إذا كنت بحاجة إلى استخدام نفس المشروع لعدة تطبيقات، فستحتاج إلى شراء تراخيص إضافية. لمزيد من التفاصيل، يرجى الرجوع إلى صفحة اتفاقية الترخيص.",
    category: "Licensing",
    categoryAr: "التراخيص",
  },
  {
    id: "customization",
    question: "Can I request customization for a project?",
    questionAr: "هل يمكنني طلب تخصيص للمشروع؟",
    answer: "Yes, we offer customization services for all our projects. If you need specific features or modifications, please contact us through the Contact page or the live chat. We'll provide you with a quote based on your requirements.",
    answerAr: "نعم، نقدم خدمات التخصيص لجميع مشاريعنا. إذا كنت بحاجة إلى ميزات أو تعديلات محددة، يرجى الاتصال بنا من خلال صفحة الاتصال أو الدردشة المباشرة. سنقدم لك عرض أسعار بناءً على متطلباتك.",
    category: "Services",
    categoryAr: "الخدمات",
  },
  {
    id: "discount",
    question: "Are there any discounts available?",
    questionAr: "هل هناك أي خصومات متاحة؟",
    answer: "Yes, we offer various discounts throughout the year. We have a special 50% discount for first-time buyers, available once per user, starting from April 1, 2025. We also offer seasonal promotions and special discounts for bulk purchases. Subscribe to our newsletter to stay updated on our latest offers.",
    answerAr: "نعم، نقدم خصومات متنوعة على مدار العام. لدينا خصم خاص بنسبة 50٪ للمشترين لأول مرة، متاح مرة واحدة لكل مستخدم، بدءًا من 1 أبريل 2025. نقدم أيضًا عروض موسمية وخصومات خاصة للمشتريات بكميات كبيرة. اشترك في نشرتنا الإخبارية للبقاء على اطلاع بأحدث عروضنا.",
    category: "Promotions",
    categoryAr: "العروض الترويجية",
  },
  {
    id: "browser-compatibility",
    question: "Are the projects compatible with all browsers?",
    questionAr: "هل المشاريع متوافقة مع جميع المتصفحات؟",
    answer: "Yes, all our projects are thoroughly tested and compatible with major browsers including Chrome, Firefox, Safari, Edge, and Opera. We ensure cross-browser compatibility and responsive design for all screen sizes.",
    answerAr: "نعم، يتم اختبار جميع مشاريعنا بدقة وهي متوافقة مع المتصفحات الرئيسية بما في ذلك Chrome و Firefox و Safari و Edge و Opera. نحن نضمن التوافق عبر المتصفحات والتصميم المتجاوب لجميع أحجام الشاشات.",
    category: "Technical",
    categoryAr: "التقنية",
  },
];

// استخراج فئات فريدة من الأسئلة
const extractCategories = (items: FAQItem[], language: string) => {
  const categories = new Set<string>();
  items.forEach((item) => {
    categories.add(language === 'ar' ? item.categoryAr : item.category);
  });
  return Array.from(categories);
};

export default function FAQPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // استخراج الفئات
  const categories = extractCategories(faqItems, language);

  // تصفية الأسئلة بناءً على البحث والفئة المختارة
  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch = 
      (language === 'ar' ? item.questionAr : item.question)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (language === 'ar' ? item.answerAr : item.answer)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || 
      (language === 'ar' ? item.categoryAr : item.category) === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">{t('FAQ.title')}</h1>
          <p className="text-muted-foreground text-center mb-8">{t('FAQ.subtitle')}</p>

          {/* قسم البحث */}
          <div className="flex flex-col space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('FAQ.searchPlaceholder')}
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* فلترة حسب الفئة */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                {t('FAQ.allCategories')}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* عرض الأسئلة الشائعة */}
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="border rounded-lg p-2 shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-4 px-2 text-lg font-medium">
                    {language === 'ar' ? faq.questionAr : faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-2 py-4 text-muted-foreground">
                    <p 
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                      className="text-foreground"
                    >
                      {language === 'ar' ? faq.answerAr : faq.answer}
                    </p>
                    <div className="mt-2 pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {t('FAQ.category')}: {language === 'ar' ? faq.categoryAr : faq.category}
                      </span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">
                {t('FAQ.noResults')}
              </p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
              >
                {t('FAQ.clearSearch')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}