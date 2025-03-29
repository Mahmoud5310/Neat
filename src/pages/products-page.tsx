import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Project, Category } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  // Extract query parameters manually
  const searchString = location.split('?')[1] || '';
  const searchParams = new URLSearchParams(searchString);
  
  // Get any category filter from URL
  const categoryParam = searchParams.get('category');
  const initialCategory = categoryParam ? parseInt(categoryParam) : undefined;
  
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Fetch all projects
  const { 
    data: projects = [], 
    isLoading: isLoadingProjects 
  } = useQuery<Project[]>({ 
    queryKey: ['/api/projects'],
  });
  
  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories 
  } = useQuery<Category[]>({ 
    queryKey: ['/api/categories'],
  });
  
  // Filter and sort projects
  const filteredProjects = projects.filter(project => {
    // Filter by category if selected
    if (selectedCategory && project.categoryId !== selectedCategory) {
      return false;
    }
    
    // Filter by search query if provided
    if (searchQuery) {
      const title = language === 'ar' ? project.titleAr : project.title;
      const description = language === 'ar' ? project.descriptionAr : project.description;
      const searchLower = searchQuery.toLowerCase();
      
      return (
        title.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        project.technologies?.some(tech => tech.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Sort filtered projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'newest':
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      case 'featured':
      default:
        // Sort by featured order or fallback to id
        const aOrder = a.featuredOrder !== null && a.featuredOrder !== undefined ? a.featuredOrder : Number.MAX_SAFE_INTEGER;
        const bOrder = b.featuredOrder !== null && b.featuredOrder !== undefined ? b.featuredOrder : Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
    }
  });
  
  // Clear search when navigating away
  useEffect(() => {
    return () => {
      setSearchQuery('');
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{t('products.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('products.description')}
        </p>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('products.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4">
          <Select 
            value={selectedCategory?.toString() || 'all'}
            onValueChange={(value) => setSelectedCategory(value !== 'all' ? parseInt(value) : undefined)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('products.filter')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('products.allCategories')}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {language === 'ar' ? category.nameAr : category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('products.sort')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t('products.sortFeatured')}</SelectItem>
              <SelectItem value="priceAsc">{t('products.sortPriceAsc')}</SelectItem>
              <SelectItem value="priceDesc">{t('products.sortPriceDesc')}</SelectItem>
              <SelectItem value="newest">{t('products.sortNewest')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Applied filters */}
      {(selectedCategory || searchQuery) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategory && (
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <span>
                {t('products.category')}: {
                  categories.find(c => c.id === selectedCategory) 
                    ? (language === 'ar' 
                      ? categories.find(c => c.id === selectedCategory)?.nameAr 
                      : categories.find(c => c.id === selectedCategory)?.name)
                    : selectedCategory
                }
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1 ml-1" 
                onClick={() => setSelectedCategory(undefined)}
              >
                <i className="fas fa-times text-xs"></i>
              </Button>
            </div>
          )}
          
          {searchQuery && (
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <span>
                {t('products.search')}: {searchQuery}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1 ml-1" 
                onClick={() => setSearchQuery('')}
              >
                <i className="fas fa-times text-xs"></i>
              </Button>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm" 
            onClick={() => {
              setSelectedCategory(undefined);
              setSearchQuery('');
            }}
          >
            {t('products.clearAll')}
          </Button>
        </div>
      )}
      
      {/* Project count */}
      <div className="mb-6 text-sm text-gray-500">
        {t('products.showing')} {sortedProjects.length} {t('products.items')}
      </div>
      
      {/* Project grid */}
      {isLoadingProjects ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium mb-2">{t('products.noResults')}</h3>
          <p className="text-gray-500">{t('products.tryDifferent')}</p>
        </div>
      )}
    </div>
  );
}
