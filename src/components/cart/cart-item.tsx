import { Project } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface CartItemProps {
  item: Project;
}

export default function CartItem({ item }: CartItemProps) {
  const { language } = useLanguage();
  const { removeItem } = useCart();
  
  const title = language === 'ar' ? item.titleAr : item.title;
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b dark:border-gray-700">
      <div className="flex items-center space-x-4 rtl:space-x-reverse mb-2 sm:mb-0">
        <img 
          src={item.imageUrl} 
          alt={title}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <h3 className="font-medium">{title}</h3>
          <div className="flex flex-wrap mt-1">
            {item.technologies?.slice(0, 2).map((tech, index) => (
              <span key={index} className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded mr-1 mb-1">
                {tech}
              </span>
            ))}
            {item.technologies && item.technologies.length > 2 && (
              <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                +{item.technologies.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 rtl:space-x-reverse w-full sm:w-auto">
        <span className="font-bold">
          {language === 'ar' ? `${item.price}$` : `$${item.price}`}
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => removeItem(item.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
