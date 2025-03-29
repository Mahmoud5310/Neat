import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Project, Category, Testimonial } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { PATHS, PROJECT_CATEGORIES, TRANSLATIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ProjectCard from '@/components/project-card';
import CategoryCard from '@/components/category-card';
import TestimonialCard from '@/components/testimonial-card';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();

  // Fetch featured projects
  const { 
    data: featuredProjects = [], 
    isLoading: isLoadingFeatured 
  } = useQuery<Project[]>({ 
    queryKey: ['/api/featured-projects'],
  });

  // Fetch categories
  const { 
    data: categories = PROJECT_CATEGORIES, 
    isLoading: isLoadingCategories 
  } = useQuery<Category[]>({ 
    queryKey: ['/api/categories'],
  });

  // Fetch testimonials
  const { 
    data: testimonials = [], 
    isLoading: isLoadingTestimonials 
  } = useQuery<Testimonial[]>({ 
    queryKey: ['/api/testimonials'],
  });

  // Get spotlight project (first featured project)
  const spotlightProject = featuredProjects.length > 0 ? featuredProjects[0] : null;

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {t('home.hero.title')}
              </h1>
              <p className="text-lg mb-6">
                {t('home.hero.description')}
              </p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <Link href="#featured">
                  <Button className="bg-white text-primary font-medium hover:bg-gray-100">
                    {t('home.hero.browseProjects')}
                  </Button>
                </Link>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  {t('home.hero.learnMore')}
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Programming Project" 
                className="rounded-lg shadow-lg max-w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="featured" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.featured.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.featured.description')}
            </p>
          </div>
          
          {isLoadingFeatured ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('products.noResults')}</p>
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link href={PATHS.PRODUCTS}>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                {t('common.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.categories.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.categories.description')}
            </p>
          </div>
          
          {isLoadingCategories ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  category={{
                    ...category,
                    projectCount: 'projectCount' in category ? category.projectCount : category.count ?? null,
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Product Detail Preview */}
      {spotlightProject && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('home.spotlight.title')}</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('home.spotlight.description')}
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="lg:w-1/2">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={spotlightProject.imageUrl} 
                    alt={language === 'ar' ? spotlightProject.titleAr : spotlightProject.title} 
                    className="w-full h-auto"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={spotlightProject.imageUrl} 
                      alt="Screenshot 1" 
                      className="w-full h-16 object-cover cursor-pointer"
                    />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={spotlightProject.imageUrl} 
                      alt="Screenshot 2" 
                      className="w-full h-16 object-cover cursor-pointer"
                    />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={spotlightProject.imageUrl} 
                      alt="Screenshot 3" 
                      className="w-full h-16 object-cover cursor-pointer"
                    />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                    <img 
                      src={spotlightProject.imageUrl} 
                      alt="More Screenshots" 
                      className="w-full h-16 object-cover cursor-pointer opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold">+5</div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {language === 'ar' ? spotlightProject.titleAr : spotlightProject.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-2 rtl:mr-2 rtl:ml-0">
                        {language === 'ar' ? '(٢٩ تقييماً)' : '(29 reviews)'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-accent px-4 py-2 rounded-md text-white">
                    <span className="text-xl font-bold">
                      {language === 'ar' ? `${spotlightProject.price}$` : `$${spotlightProject.price}`}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {language === 'ar' ? spotlightProject.descriptionAr : spotlightProject.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <i className="fas fa-code text-primary mr-2 rtl:ml-2 rtl:mr-0"></i>
                      <span>{spotlightProject.technologies?.slice(0, 2).join(' + ')}</span>
                    </div>
                    {spotlightProject.technologies && spotlightProject.technologies.length > 2 && (
                      <div className="flex items-center">
                        <i className="fas fa-database text-primary mr-2 rtl:ml-2 rtl:mr-0"></i>
                        <span>{spotlightProject.technologies[2]}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <i className="fas fa-cloud text-primary mr-2 rtl:ml-2 rtl:mr-0"></i>
                      <span>{language === 'ar' ? 'متوافق مع AWS' : 'AWS Compatible'}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-mobile-alt text-primary mr-2 rtl:ml-2 rtl:mr-0"></i>
                      <span>{language === 'ar' ? 'تصميم متجاوب' : 'Responsive Design'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {spotlightProject.technologies?.map((tech, index) => (
                      <span key={index} className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Link href={PATHS.PRODUCT_DETAIL(spotlightProject.id)}>
                    <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                      <i className={`fas fa-shopping-cart ${language === 'ar' ? 'ml-2' : 'mr-2'}`}></i>
                      {t('common.buyNow')}
                    </Button>
                  </Link>
                  
                  {spotlightProject.demoUrl && (
                    <a href={spotlightProject.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Button 
                        variant="outline" 
                        className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        <i className={`fas fa-eye ${language === 'ar' ? 'ml-2' : 'mr-2'}`}></i>
                        {t('productDetail.viewDemo')}
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.testimonials.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.testimonials.description')}
            </p>
          </div>
          
          {isLoadingTestimonials ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('common.noTestimonials')}</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.howItWorks.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.howItWorks.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Access steps directly from constants to support array mapping */}
            {TRANSLATIONS[language as 'en' | 'ar'].home.howItWorks.steps.map((step: any, index: number) => (
              <div key={index} className="text-center">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter & Discount */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{t('home.newsletter.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('home.newsletter.description')}
                </p>
              </div>
              
              <form className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input 
                    type="email" 
                    placeholder={t('home.newsletter.placeholder')} 
                    className="flex-grow"
                  />
                  <Button className="bg-primary hover:bg-primary-dark text-white">
                    {t('home.newsletter.button')}
                  </Button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {t('home.newsletter.terms')}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
