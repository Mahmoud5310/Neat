import { Link } from 'wouter';
import { Category } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { PATHS } from '@/lib/constants';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { language } = useLanguage();
  
  const name = language === 'ar' ? category.nameAr : category.name;
  const count = category.projectCount;
  
  return (
    <Link href={`${PATHS.PRODUCTS}?category=${category.id}`} className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center shadow hover:shadow-md transition transform hover:-translate-y-1 block">
      <div className="text-primary text-4xl mb-4">
        <i className={`fas ${category.icon}`}></i>
      </div>
      <h3 className="text-lg font-bold mb-2">{name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {language === 'ar' 
          ? `${count} ${count === 1 ? 'مشروع' : 'مشاريع'}` 
          : `${count} ${count === 1 ? 'project' : 'projects'}`}
      </p>
    </Link>
  );
}
