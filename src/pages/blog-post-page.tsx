import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BlogPost, BlogComment, InsertBlogComment } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useAnalytics } from "@/hooks/use-analytics";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/lib/constants";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  Clock, 
  Eye, 
  Tag, 
  MessageSquare, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  ArrowLeft, 
  ThumbsUp 
} from "lucide-react";

// Schema for comment form
const commentSchema = z.object({
  content: z.string().min(3, "Comment must be at least 3 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  email: z.string().email("Please enter a valid email").optional(),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export default function BlogPostPage() {
  const [location] = useLocation();
  const match = /^\/blog\/([^/]+)/.exec(location);
  const slug = match ? match[1] : undefined;
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const { toast } = useToast();
  const [showShareButtons, setShowShareButtons] = useState(false);
  
  // Fetch blog post by slug
  const { 
    data: post, 
    isLoading: postLoading,
    error: postError,
  } = useQuery<BlogPost>({
    queryKey: ["/api/blog/posts/slug", slug],
    enabled: !!slug,
  });
  
  // Fetch comments for the post
  const { 
    data: comments, 
    isLoading: commentsLoading,
  } = useQuery<BlogComment[]>({
    queryKey: ["/api/blog/posts", post?.id, "comments"],
    enabled: !!post,
  });
  
  // Fetch related posts
  const { 
    data: relatedPosts, 
    isLoading: relatedLoading,
  } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts", post?.id, "related"],
    enabled: !!post,
  });
  
  // Form for adding comments
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      name: user ? undefined : "",
      email: user ? undefined : "",
    },
  });
  
  // Submit comment mutation
  const commentMutation = useMutation({
    mutationFn: async (data: CommentFormValues) => {
      const commentData: any = {
        postId: post!.id,
        content: data.content,
      };
      
      if (user) {
        commentData.userId = (user as any).id;
      } else {
        commentData.name = data.name;
        commentData.email = data.email;
      }
      
      const response = await apiRequest("POST", "/api/blog/comments", commentData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t("blog.commentSuccess"),
        description: t("blog.commentSuccessMessage"),
      });
      
      form.reset();
      
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({
        queryKey: ["/api/blog/posts", post?.id, "comments"],
      });
      
      // Track event
      trackEvent({
        event: "comment",
        page: "/blog/" + slug,
        metadata: { postId: post?.id }
      });
    },
    onError: (error) => {
      toast({
        title: t("blog.commentError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle share button
  const handleShare = () => {
    setShowShareButtons(!showShareButtons);
  };
  
  // Get URL for sharing
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Share to social media
  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    trackEvent({
      event: "share",
      page: "/blog/" + slug,
      metadata: { platform: "facebook" }
    });
  };
  
  const shareToTwitter = () => {
    const title = language === 'ar' ? post?.titleAr : post?.title;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title || "")}&url=${encodeURIComponent(shareUrl)}`, "_blank");
    trackEvent({
      event: "share",
      page: "/blog/" + slug,
      metadata: { platform: "twitter" }
    });
  };
  
  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
    trackEvent({
      event: "share",
      page: "/blog/" + slug,
      metadata: { platform: "linkedin" }
    });
  };
  
  // Handle form submission
  const onSubmit = (data: CommentFormValues) => {
    commentMutation.mutate(data);
  };
  
  // Track page view
  useEffect(() => {
    if (post) {
      trackEvent({
        event: "page_view",
        page: "/blog/" + slug,
        metadata: { postId: post.id }
      });
    }
  }, [post, slug, trackEvent]);
  
  if (postLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (postError || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{t("blog.postNotFound")}</h1>
          <p className="mb-8 text-muted-foreground">{t("blog.postNotFoundMessage")}</p>
          <Button asChild>
            <Link href={PATHS.BLOG}>{t("blog.backToBlog")}</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const title = language === 'ar' ? post.titleAr : post.title;
  const content = language === 'ar' ? post.contentAr : post.content;
  const tags = language === 'ar' ? post.tagsAr : post.tags;
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    language === 'ar' ? 'ar-SA' : 'en-US', 
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to blog */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href={PATHS.BLOG} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t("blog.backToBlog")}
          </Link>
        </Button>
      </div>
      
      {/* Article Header */}
      <article className="max-w-4xl mx-auto">
        {post.featuredImage && (
          <div className="w-full h-72 sm:h-96 overflow-hidden rounded-lg mb-8">
            <img 
              src={post.featuredImage} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-4" dir={isRtl ? "rtl" : "ltr"}>
          {title}
        </h1>
        
        {/* Post metadata */}
        <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-8 gap-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{post.viewCount || 0}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{comments?.length || 0}</span>
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center" 
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t("blog.share")}
            </Button>
            
            {showShareButtons && (
              <div className="absolute top-full mt-2 bg-card border rounded-md shadow-md p-2 flex space-x-2 rtl:space-x-reverse z-10">
                <Button variant="outline" size="icon" onClick={shareToFacebook}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={shareToTwitter}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={shareToLinkedIn}>
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Post content */}
        <div 
          className="prose dark:prose-invert prose-img:rounded-lg max-w-none mb-12"
          dir={isRtl ? "rtl" : "ltr"}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
        
        {/* Comments section */}
        <Separator className="my-8" />
        <h3 className="text-2xl font-bold mb-6">
          {t("blog.comments")} ({comments?.length || 0})
        </h3>
        
        {/* Comments form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("blog.leaveComment")}</CardTitle>
            <CardDescription>
              {user 
                ? t("blog.commentAsUser", { username: user.displayName || user.email || t("blog.anonymousUser") })
                : t("blog.commentAsGuest")
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {!user && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("blog.yourName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("blog.namePlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("blog.yourEmail")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("blog.emailPlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("blog.yourComment")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("blog.commentPlaceholder")}
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit"
                  disabled={commentMutation.isPending}
                  className="mt-2"
                >
                  {commentMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("blog.submitComment")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Comments list */}
        {commentsLoading ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10 mr-4 rtl:ml-4 rtl:mr-0">
                      <AvatarFallback>
                        {comment.name 
                          ? comment.name.substring(0, 2).toUpperCase() 
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {comment.name || "User"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : 'en-US',
                            { year: 'numeric', month: 'short', day: 'numeric' }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p dir={isRtl ? "rtl" : "ltr"}>{comment.content}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t("blog.likeComment")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground my-8">
            {t("blog.noComments")}
          </p>
        )}
      </article>
      
      {/* Related posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto mt-16">
          <Separator className="my-8" />
          <h3 className="text-2xl font-bold mb-6">{t("blog.relatedPosts")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card 
                key={relatedPost.id}
                className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                onClick={() => window.location.href = `/blog/${relatedPost.slug}`}
              >
                {relatedPost.featuredImage && (
                  <div className="w-full h-40 overflow-hidden">
                    <img 
                      src={relatedPost.featuredImage} 
                      alt={language === 'ar' ? relatedPost.titleAr : relatedPost.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {language === 'ar' ? relatedPost.titleAr : relatedPost.title}
                  </CardTitle>
                </CardHeader>
                
                <CardFooter>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    <span>
                      {new Date(relatedPost.publishedAt).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple markdown renderer for content
function renderMarkdown(content: string): string {
  // Replace markdown headers with HTML tags
  let html = content
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
    .replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
  
  // Replace **bold** text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace *italic* text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Replace links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Replace lists
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n)+/g, '<ul>$&</ul>');
  
  // Replace paragraphs (ensure empty lines are preserved)
  html = html.replace(/^(?!<[a-z])(.*?)$/gm, function(match) {
    return match.trim() ? '<p>' + match + '</p>' : '';
  });
  
  return html;
}