import { Link } from 'wouter';
import { useLanguage } from '@/hooks/use-language';
import { PATHS } from '@/lib/constants';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <span className="text-primary text-3xl"><i className="fas fa-code"></i></span>
              <span className="text-2xl font-bold">Neat</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <button className="text-gray-400 hover:text-primary" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="text-gray-400 hover:text-primary" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="text-gray-400 hover:text-primary" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </button>
              <button className="text-gray-400 hover:text-primary" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={PATHS.HOME} className="text-gray-400 hover:text-primary">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link href={PATHS.PRODUCTS} className="text-gray-400 hover:text-primary">
                  {t('common.products')}
                </Link>
              </li>
              <li>
                <Link href={PATHS.ABOUT} className="text-gray-400 hover:text-primary">
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link href={PATHS.CONTACT} className="text-gray-400 hover:text-primary">
                  {t('common.contact')}
                </Link>
              </li>
              <li>
                <Link href={PATHS.FAQ} className="text-gray-400 hover:text-primary">
                  {t('FAQ.title')}
                </Link>
              </li>
              <li>
                <Link href={PATHS.BLOG} className="text-gray-400 hover:text-primary">
                  {t('blog.title')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.categories')}</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-primary text-left w-full">
                  E-commerce
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary text-left w-full">
                  Mobile Apps
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary text-left w-full">
                  Productivity
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-primary text-left w-full">
                  Analytics
                </button>
              </li>
              <li>
                <Link href={PATHS.PRODUCTS} className="text-gray-400 hover:text-primary">
                  {t('footer.allCategories')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <i className="fas fa-map-marker-alt mt-1 text-primary"></i>
                <span className="text-gray-400">123 Developer Street, Cairo, Egypt</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className="fas fa-envelope text-primary"></i>
                <span className="text-gray-400">support@neat.com</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className="fas fa-phone text-primary"></i>
                <span className="text-gray-400">+20 123 456 7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright and Terms */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Neat. {t('footer.allRightsReserved')}</p>
          
          <div className="flex space-x-4 rtl:space-x-reverse mt-4 md:mt-0">
            <button className="text-gray-400 hover:text-primary text-sm">{t('footer.privacyPolicy')}</button>
            <button className="text-gray-400 hover:text-primary text-sm">{t('footer.termsOfService')}</button>
            <button className="text-gray-400 hover:text-primary text-sm">{t('footer.refundPolicy')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
