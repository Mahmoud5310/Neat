import { Testimonial } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { language } = useLanguage();
  
  const customerName = language === 'ar' ? testimonial.customerNameAr : testimonial.customerName;
  const position = language === 'ar' ? testimonial.positionAr : testimonial.position;
  const content = language === 'ar' ? testimonial.contentAr : testimonial.content;
  
  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(testimonial.rating);
    const hasHalfStar = testimonial.rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars to make total of 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };
  
  return (
    <Card className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
      <CardContent className="p-0">
        <div className="flex text-yellow-400 mb-4">
          {renderStars()}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-4">"{content}"</p>
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4 rtl:ml-4 rtl:mr-0">
            <AvatarImage 
              src={testimonial.avatarUrl} 
              alt={customerName}
            />
            <AvatarFallback>{customerName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold">{customerName}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{position}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
