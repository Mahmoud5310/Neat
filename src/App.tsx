import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "./context/language-context";
import { CartProvider } from "./context/cart-context";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import ChatButton from "@/components/chat/chat-button";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductsPage from "@/pages/products-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import AccountPage from "@/pages/account-page";
import CheckoutPage from "@/pages/checkout-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import DownloadPage from "@/pages/download-page";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import BlogPage from "@/pages/blog-page";
import BlogPostPage from "@/pages/blog-post-page";
import FAQPage from "@/pages/faq-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/download/:id" component={DownloadPage} />
      <ProtectedRoute path="/analytics" component={AnalyticsDashboard} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/faq" component={FAQPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Router />
              </main>
              <Footer />
              <ChatButton />
            </div>
            <Toaster />
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
