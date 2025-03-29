import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogPost, BlogCategory } from "@shared/schema";
import { Loader2, Search, Clock, Eye, MessageSquare, Tag } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAnalytics } from "@/hooks/use-analytics";

export default function BlogPage() {
  const { language, t } = useLanguage();
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { trackEvent } = useAnalytics();
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Fetch blog posts
  const { 
    data: posts, 
    isLoading: postsLoading,
    error: postsError 
  } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch blog categories
  const { 
    data: categories, 
    isLoading: categoriesLoading,
    error: categoriesError 
  } = useQuery<BlogCategory[]>({
    queryKey: ["/api/blog/categories"],
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  // Search blog posts
  const { 
    data: searchResults, 
    isLoading: searchLoading,
    refetch: searchRefetch
  } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/search", searchQuery],
    enabled: false,
  });
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchRefetch();
      trackEvent({
        event: "search",
        page: "/blog",
        metadata: { query: searchQuery }
      });
    }
  };
  
  // Filter posts by category
  const filteredPosts = () => {
    if (searchResults) return searchResults;
    
    if (!posts) return [];
    
    if (activeCategory === "all") return posts;
    
    const categoryId = parseInt(activeCategory);
    return posts.filter(post => post.categoryId === categoryId);
  };
  
  // Track page view
  useEffect(() => {
    trackEvent({
      event: "page_view",
      page: "/blog"
    });
  }, [trackEvent]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("blog.title")}
          </h1>
          <p className="text-muted-foreground max-w-xl">
            {t("blog.description")}
          </p>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder={t("blog.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="outline" size="icon">
            {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </form>
      </div>
      
      {/* Categories Tabs */}
      <div className="mt-8">
        {categoriesLoading ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : categoriesError ? (
          <p className="text-center text-destructive my-8">
            {t("blog.categoriesError")}
          </p>
        ) : (
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-8 flex flex-wrap">
              <TabsTrigger value="all">
                {t("blog.allPosts")}
              </TabsTrigger>
              {categories?.map(category => (
                <TabsTrigger key={category.id} value={category.id.toString()}>
                  {language === 'ar' ? category.nameAr : category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Blog Posts Grid */}
            <TabsContent value={activeCategory} className="mt-6">
              {postsLoading || searchLoading ? (
                <div className="flex justify-center my-12">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : postsError ? (
                <p className="text-center text-destructive my-8">
                  {t("blog.postsError")}
                </p>
              ) : filteredPosts().length === 0 ? (
                <div className="text-center my-12">
                  <p className="text-xl font-medium mb-2">
                    {searchResults ? t("blog.noSearchResults") : t("blog.noPosts")}
                  </p>
                  {searchResults && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      {t("blog.clearSearch")}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts().map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

interface BlogPostCardProps {
  post: BlogPost;
}

function BlogPostCard({ post }: BlogPostCardProps) {
  const { language, t } = useLanguage();
  const [_, navigate] = useLocation();
  const isRtl = language === 'ar';
  
  const handlePostClick = () => {
    navigate(`/blog/${post.slug}`);
  };
  
  const title = language === 'ar' ? post.titleAr : post.title;
  const summary = language === 'ar' ? post.summaryAr : post.summary;
  const tags = language === 'ar' ? post.tagsAr : post.tags;
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    language === 'ar' ? 'ar-SA' : 'en-US', 
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={handlePostClick}>
      {post.featuredImage && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={post.featuredImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4 rtl:space-x-reverse">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
            <span>{post.viewCount}</span>
          </div>
        </div>
        
        {summary && (
          <p className="text-muted-foreground line-clamp-3 mb-4" dir={isRtl ? "rtl" : "ltr"}>
            {summary}
          </p>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handlePostClick}>
          {t("blog.readMore")}
        </Button>
      </CardFooter>
    </Card>
  );
}