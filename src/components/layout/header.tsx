import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { LanguageSelector } from '@/components/language-selector';
import { PATHS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, Menu, X, ShoppingCart } from 'lucide-react';

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const { t, language, changeLanguage, isRtl } = useLanguage();
  const { cart } = useCart();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      {/* Banner showing website launch date */}
      <div className="bg-primary text-white py-2 text-center font-medium">
        <p className="text-sm md:text-base" dir="auto">
          {language === 'ar' 
            ? "الموقع قيد التطوير وسيتم إطلاقه رسمياً في 1/1/2026" 
            : "This website is under development and will officially launch on 1/1/2026"}
        </p>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href={PATHS.HOME} className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-primary text-3xl">
              <i className="fas fa-code"></i>
            </span>
            <span className="text-2xl font-bold">Neat</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link href={PATHS.HOME} className={`font-medium transition hover:text-primary ${location === PATHS.HOME ? 'text-primary' : ''}`}>
              {t('common.home')}
            </Link>
            <Link href={PATHS.PRODUCTS} className={`font-medium transition hover:text-primary ${location === PATHS.PRODUCTS ? 'text-primary' : ''}`}>
              {t('common.products')}
            </Link>
            <Link href={PATHS.BLOG} className={`font-medium transition hover:text-primary ${location === PATHS.BLOG ? 'text-primary' : ''}`}>
              {t('blog.title')}
            </Link>
            <Link href={PATHS.ABOUT} className={`font-medium transition hover:text-primary ${location === PATHS.ABOUT ? 'text-primary' : ''}`}>
              {t('common.about')}
            </Link>
            <Link href={PATHS.CONTACT} className={`font-medium transition hover:text-primary ${location === PATHS.CONTACT ? 'text-primary' : ''}`}>
              {t('common.contact')}
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            
            {/* Cart */}
            <Link href={PATHS.CART} className="relative text-lg hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 rtl:right-auto rtl:-left-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {/* User Menu (Logged In) */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user.email?.split('@')[0] || 'User'}&background=random`} alt={user.email || 'User'} />
                      <AvatarFallback>{(user.email?.substring(0, 2) || 'U').toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align={isRtl ? "start" : "end"} forceMount>
                  <DropdownMenuItem asChild>
                    <Link href={PATHS.ACCOUNT} className="cursor-pointer w-full">
                      {t('common.myAccount')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link href={PATHS.AUTH} className="text-sm font-medium hover:text-primary transition">
                  {t('common.login')}
                </Link>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <Link href={PATHS.AUTH} className="text-sm font-medium hover:text-primary transition">
                  {t('common.register')}
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-3">
              <Link href={PATHS.HOME} className={`font-medium transition hover:text-primary ${location === PATHS.HOME ? 'text-primary' : ''}`}>
                {t('common.home')}
              </Link>
              <Link href={PATHS.PRODUCTS} className={`font-medium transition hover:text-primary ${location === PATHS.PRODUCTS ? 'text-primary' : ''}`}>
                {t('common.products')}
              </Link>
              <Link href={PATHS.BLOG} className={`font-medium transition hover:text-primary ${location === PATHS.BLOG ? 'text-primary' : ''}`}>
                {t('blog.title')}
              </Link>
              <Link href={PATHS.ABOUT} className={`font-medium transition hover:text-primary ${location === PATHS.ABOUT ? 'text-primary' : ''}`}>
                {t('common.about')}
              </Link>
              <Link href={PATHS.CONTACT} className={`font-medium transition hover:text-primary ${location === PATHS.CONTACT ? 'text-primary' : ''}`}>
                {t('common.contact')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
