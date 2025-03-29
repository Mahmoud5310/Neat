import { Link } from 'wouter';
import { Project } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PATHS } from '@/lib/constants';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { isRtl, language } = useLanguage();
  const { addItem } = useCart();
  
  const title = language === 'ar' ? project.titleAr : project.title;
  const description = language === 'ar' ? project.descriptionAr : project.description;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(project);
  };
  
  return (
    <Card className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group">
      <div className="relative">
        <img 
          src={project.imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <Link href={PATHS.PRODUCT_DETAIL(project.id)}>
            <Button variant="primary" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium">
              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
            </Button>
          </Link>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className="bg-secondary text-white text-sm px-2 py-1 rounded-md">
            {language === 'ar' ? `${project.price}$` : `$${project.price}`}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.map((tech, index) => (
            <span key={index} className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-primary hover:bg-primary-dark text-white"
        >
          <i className={`fas fa-shopping-cart ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
          {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
}
