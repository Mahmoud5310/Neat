import { useState } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { PATHS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ProjectCard from '@/components/project-card';
import { Loader2, ExternalLink } from 'lucide-react';

export default function ProductDetailPage() {
  const { t, language, isRtl } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/products/:id');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Extract ID from URL parameters
  const projectId = match ? parseInt(params.id) : null;
  
  // Fetch project details
  const { 
    data: project, 
    isLoading,
    error
  } = useQuery<Project | undefined>({ 
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId
  });
  
  // Fetch related projects (same category)
  const { 
    data: relatedProjects = [], 
    isLoading: isLoadingRelated 
  } = useQuery<Project[]>({ 
    queryKey: [`/api/categories/${project?.categoryId}/projects`],
    enabled: !!project?.categoryId,
  });
  
  // Filter out current project from related projects
  const filteredRelatedProjects = relatedProjects.filter(p => p.id !== projectId);
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (project) {
      addItem(project);
    }
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    if (project) {
      addItem(project);
      navigate(PATHS.CHECKOUT);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Show error state
  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('common.error')}</h1>
        <p className="mb-6">{t('productDetail.notFound')}</p>
        <Link href={PATHS.PRODUCTS}>
          <Button>{t('common.backToProducts')}</Button>
        </Link>
      </div>
    );
  }
  
  // Extract project data based on current language
  const title = language === 'ar' ? project.titleAr : project.title;
  const description = language === 'ar' ? project.descriptionAr : project.description;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left column: Images */}
        <div className="lg:w-1/2">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img 
              src={project.imageUrl} 
              alt={title} 
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            <div 
              className={`bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer 
                ${activeImageIndex === 0 ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveImageIndex(0)}
            >
              <img 
                src={project.imageUrl} 
                alt={`${title} - Preview 1`} 
                className="w-full h-16 object-cover"
              />
            </div>
            {/* Mock additional images for UI completeness */}
            {[1, 2, 3].map((index) => (
              <div 
                key={index}
                className={`bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer
                  ${activeImageIndex === index ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={project.imageUrl} 
                  alt={`${title} - Preview ${index + 1}`}
                  className="w-full h-16 object-cover" 
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Right column: Details and Actions */}
        <div className="lg:w-1/2">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{title}</h1>
              <span className="bg-accent px-4 py-2 rounded-md text-white font-bold">
                {language === 'ar' ? `${project.price}$` : `$${project.price}`}
              </span>
            </div>
            
            <div className="flex items-center mt-2 mb-4">
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
            
            <Separator className="my-4" />
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <i className="fas fa-code text-primary mr-2 rtl:ml-2 rtl:mr-0"></i>
                <span>{project.technologies?.slice(0, 2).join(' + ')}</span>
              </div>
              {project.technologies && project.technologies.length > 2 && (
                <div className="flex items-center">
                  <i className="fas fa-database text-primary mr-2 rtl:ml-2 rtl:mr-0"></i>
                  <span>{project.technologies[2]}</span>
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
              {project.technologies?.map((tech, index) => (
                <span key={index} className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <Button 
                className="w-full bg-primary hover:bg-primary-dark text-white"
                onClick={handleBuyNow}
              >
                <i className={`fas fa-shopping-cart ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
                {t('common.buyNow')}
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleAddToCart}
              >
                <i className={`fas fa-cart-plus ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
                {t('common.addToCart')}
              </Button>
              
              {project.demoUrl && (
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full"
                >
                  <Button 
                    variant="outline" 
                    className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <ExternalLink className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    {t('productDetail.viewDemo')}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for additional info */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="description">{t('productDetail.description')}</TabsTrigger>
            <TabsTrigger value="features">{t('productDetail.features')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('productDetail.reviews')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="py-6">
            {/* Extended description would go here */}
            <p className="mb-4">{description}</p>
            <p className="mb-4">{description}</p>
          </TabsContent>
          
          <TabsContent value="features" className="py-6">
            <h3 className="text-xl font-bold mb-4">{t('productDetail.keyFeatures')}</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>{t('productDetail.featureExample1')}</li>
              <li>{t('productDetail.featureExample2')}</li>
              <li>{t('productDetail.featureExample3')}</li>
              <li>{t('productDetail.featureExample4')}</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">{t('productDetail.customerReviews')}</h3>
              
              {/* Sample reviews */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="font-bold">John Doe</span>
                    <span className="text-gray-500 text-sm ml-2">- 2 weeks ago</span>
                  </div>
                  <p>{t('productDetail.reviewExample')}</p>
                </div>
              </div>
              
              {/* Add review button (for authenticated users) */}
              {user ? (
                <Button className="mt-4">
                  <i className="fas fa-pen mr-2"></i>
                  {t('productDetail.leaveReview')}
                </Button>
              ) : (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="mb-2">{t('productDetail.loginToReview')}</p>
                  <Link href={PATHS.AUTH}>
                    <Button size="sm">
                      {t('common.login')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related projects */}
      {filteredRelatedProjects.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t('productDetail.relatedProjects')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRelatedProjects.slice(0, 3).map((relatedProject) => (
              <ProjectCard key={relatedProject.id} project={relatedProject} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
