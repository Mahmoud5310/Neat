import { Link } from 'wouter';
import { useLanguage } from '@/hooks/use-language';
import { PATHS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  UserIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon, 
  HeartIcon, 
  LightbulbIcon, 
  CodeIcon 
} from 'lucide-react';

export default function AboutPage() {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  
  // الفريق
  const team = [
    {
      name: isRtl ? 'أحمد محمد' : 'Ahmed Mohamed',
      position: isRtl ? 'المؤسس والرئيس التنفيذي' : 'Founder & CEO',
      bio: isRtl 
        ? 'مطور ويب مخضرم مع أكثر من 10 سنوات من الخبرة في تطوير حلول البرمجيات. متخصص في JavaScript والحلول السحابية.'
        : 'Seasoned web developer with over 10 years of experience in software development. Specialized in JavaScript and cloud solutions.',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: isRtl ? 'سارة أحمد' : 'Sarah Ahmed',
      position: isRtl ? 'مدير تطوير المنتجات' : 'Product Development Manager',
      bio: isRtl 
        ? 'مصممة UI/UX موهوبة مع خلفية في هندسة البرمجيات. تقود فريق تطوير المنتجات لإنشاء حلول سلسة وبديهية.'
        : 'Talented UI/UX designer with a background in software engineering. Leads our product development team to create seamless and intuitive solutions.',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: isRtl ? 'خالد إبراهيم' : 'Khaled Ibrahim',
      position: isRtl ? 'رئيس قسم التكنولوجيا' : 'CTO',
      bio: isRtl 
        ? 'خبير في الأمن السيبراني والبنية التحتية السحابية. يضمن أن جميع المشاريع تلبي أعلى معايير الجودة والأمان.'
        : 'Expert in cybersecurity and cloud infrastructure. Ensures all projects meet the highest standards of quality and security.',
      imageUrl: 'https://randomuser.me/api/portraits/men/46.jpg'
    },
  ];
  
  // القيم
  const values = [
    {
      title: isRtl ? 'الجودة' : 'Quality',
      description: isRtl 
        ? 'نلتزم بتقديم مشاريع عالية الجودة تم اختبارها بدقة وتوثيقها بشكل جيد.'
        : 'We are committed to delivering high-quality projects that are thoroughly tested and well-documented.',
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary" />
    },
    {
      title: isRtl ? 'الابتكار' : 'Innovation',
      description: isRtl 
        ? 'نبقى على اطلاع دائم بأحدث التقنيات والاتجاهات لتقديم حلول مبتكرة وحديثة.'
        : 'We stay up-to-date with the latest technologies and trends to deliver innovative and modern solutions.',
      icon: <LightbulbIcon className="h-8 w-8 text-primary" />
    },
    {
      title: isRtl ? 'الدعم' : 'Support',
      description: isRtl 
        ? 'نقدم دعمًا ممتازًا لما بعد البيع لضمان نجاح مشروعك على المدى الطويل.'
        : 'We provide excellent after-sales support to ensure the long-term success of your project.',
      icon: <HeartIcon className="h-8 w-8 text-primary" />
    },
    {
      title: isRtl ? 'الشفافية' : 'Transparency',
      description: isRtl 
        ? 'نؤمن بالتواصل المفتوح والشفاف مع عملائنا في جميع مراحل المشروع.'
        : 'We believe in open and transparent communication with our clients throughout the project.',
      icon: <UserIcon className="h-8 w-8 text-primary" />
    },
    {
      title: isRtl ? 'الكفاءة' : 'Efficiency',
      description: isRtl 
        ? 'نسعى جاهدين لتقديم مشاريع عالية الأداء وكفاءة استخدام الموارد.'
        : 'We strive to deliver projects that are high-performing and resource-efficient.',
      icon: <TrendingUpIcon className="h-8 w-8 text-primary" />
    },
    {
      title: isRtl ? 'الجودة البرمجية' : 'Code Quality',
      description: isRtl 
        ? 'نلتزم بمعايير الترميز والممارسات الجيدة للحفاظ على جودة الكود وقابلية الصيانة.'
        : 'We adhere to coding standards and best practices to maintain code quality and maintainability.',
      icon: <CodeIcon className="h-8 w-8 text-primary" />
    }
  ];
  
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <section className="py-16 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {isRtl ? 'تعرف على Neat - منصة مشاريع البرمجة المميزة' : 'About Neat - Premium Programming Projects Platform'}
          </h1>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            {isRtl 
              ? 'نحن نوفر حلول برمجية عالية الجودة للمطورين والشركات. مهمتنا هي مساعدتك على إنجاز مشاريعك بسرعة وكفاءة.'
              : 'We provide high-quality programming solutions for developers and businesses. Our mission is to help you complete your projects quickly and efficiently.'}
          </p>
        </div>
      </section>
      
      {/* Mission and vision */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{isRtl ? 'مهمتنا ورؤيتنا' : 'Our Mission & Vision'}</h2>
              <Separator className="mx-auto w-24 my-4 bg-primary" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-primary text-2xl">
                    {isRtl ? 'مهمتنا' : 'Our Mission'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isRtl 
                      ? 'توفير مشاريع برمجية عالية الجودة وحلول مخصصة تمكّن المطورين والشركات من تسريع عمليات التطوير وتوفير الوقت والموارد. نحن نسعى جاهدين لتقديم الجودة والابتكار والدعم الاستثنائي في كل مشروع.'
                      : 'To provide high-quality programming projects and customized solutions that empower developers and businesses to accelerate development processes and save time and resources. We strive to deliver quality, innovation, and exceptional support in every project.'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-primary text-2xl">
                    {isRtl ? 'رؤيتنا' : 'Our Vision'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isRtl 
                      ? 'أن نصبح المنصة الرائدة عالميًا في تقديم مشاريع البرمجة والحلول الجاهزة، ممكّنين المطورين من جميع المستويات من إنشاء تطبيقات استثنائية. نحن نتصور عالمًا تكون فيه عملية التطوير متاحة وفعالة وممتعة للجميع.'
                      : 'To become the world\'s leading platform for programming projects and ready-made solutions, enabling developers of all levels to create exceptional applications. We envision a world where the development process is accessible, efficient, and enjoyable for everyone.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{isRtl ? 'قيمنا' : 'Our Values'}</h2>
            <Separator className="mx-auto w-24 my-4 bg-primary" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {isRtl 
                ? 'هذه هي المبادئ التي تقود أعمالنا وتشكل ثقافتنا:'
                : 'These are the principles that guide our work and shape our culture:'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    {value.icon}
                    <CardTitle>{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our team */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{isRtl ? 'فريقنا' : 'Our Team'}</h2>
            <Separator className="mx-auto w-24 my-4 bg-primary" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {isRtl 
                ? 'تعرف على الأشخاص الموهوبين خلف Neat:'
                : 'Meet the talented people behind Neat:'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full mx-auto overflow-hidden mb-4">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary mb-3">{member.position}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {isRtl ? 'جاهز للبدء مع Neat؟' : 'Ready to get started with Neat?'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {isRtl 
              ? 'اطلع على مجموعتنا من مشاريع البرمجة عالية الجودة واختر الحل المثالي لاحتياجاتك.'
              : 'Browse our collection of high-quality programming projects and choose the perfect solution for your needs.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link href={PATHS.PRODUCTS}>
                {isRtl ? 'استعرض المشاريع' : 'Browse Projects'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={PATHS.HOME}>
                {isRtl ? 'الصفحة الرئيسية' : 'Home Page'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}