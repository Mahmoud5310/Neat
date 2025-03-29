import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import type { FirebaseUser } from "../lib/firebase";
import { 
  Download, 
  Copy, 
  Check, 
  Calendar, 
  FileType, 
  HardDrive 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PATHS, TRANSLATIONS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { Project } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function DownloadPage() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value;
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ['/api/projects', id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/projects/${id}`);
      return await res.json();
    },
    enabled: !!id,
  });

  // في الإصدار الجديد، نفترض أن أي شخص يمكنه الوصول إلى صفحة التنزيل،
  // لذلك نفترض أن التحقق من الشراء دائمًا إيجابي
  const hasPurchased = true;
  const isCheckingPurchase = false;
  
  // تحقق إذا كان المستخدم مسجل دخول
  // سنستخدم هذا فقط للترحيب المخصص، لكن لا نمنع الوصول للزوار
  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || t('download.visitor');

  const handleDownload = async () => {
    if (!project) return;
    
    setIsDownloading(true);
    
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would fetch the file from an API or storage
      const downloadUrl = `/api/download/${id}`;
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${project.title.replace(/\s+/g, '-').toLowerCase()}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t('download.success'),
        description: t('download.startingSoon'),
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: t('download.failed'),
        description: t('download.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    if (!project) return;
    
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true);
      toast({
        title: t('download.linkCopied'),
        description: t('download.linkCopiedMessage'),
      });
      
      setTimeout(() => setLinkCopied(false), 3000);
    }).catch(err => {
      console.error("Failed to copy link:", err);
      toast({
        title: t('download.copyFailed'),
        description: t('download.copyFailedMessage'),
        variant: "destructive",
      });
    });
  };

  if (isLoading || isCheckingPurchase) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-6">
            <Skeleton className="h-12 w-1/3" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!project || !hasPurchased) {
    return <div className="container mx-auto px-4 py-12"></div>;
  }

  const title = language === 'ar' ? project.titleAr : project.title;
  const description = language === 'ar' ? project.descriptionAr : project.description;
  
  // Simulate project details that would come from the API
  const projectDetails = {
    size: '15.6 MB',
    format: 'ZIP',
    releaseDate: new Date().toISOString().split('T')[0],
    version: '1.0.0'
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto border-2 border-primary/10">
        <CardHeader className="text-center bg-primary/5 rounded-t-lg">
          <CardTitle className="text-3xl font-bold">
            {t('download.thankYou').replace('{name}', userDisplayName)}
          </CardTitle>
          <p className="text-muted-foreground mt-2">{t('download.ready')}</p>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-3">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <HardDrive className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{t('download.fileSize')}</p>
                <p className="text-lg">{projectDetails.size}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <FileType className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{t('download.fileFormat')}</p>
                <p className="text-lg">{projectDetails.format}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{t('download.releaseDate')}</p>
                <p className="text-lg">{projectDetails.releaseDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <div className="h-5 w-5 flex items-center justify-center text-primary">v</div>
              <div>
                <p className="text-sm font-medium">{t('download.version')}</p>
                <p className="text-lg">{projectDetails.version}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center items-center">
            <Button 
              size="lg" 
              className="w-full md:w-auto min-w-[200px] text-lg h-14"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin mr-2">
                    <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                  </div>
                  {t('download.downloading')}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  {t('download.downloadNow')}
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full md:w-auto min-w-[200px] text-lg h-14"
              onClick={handleCopyLink}
            >
              {linkCopied ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  {t('download.copied')}
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-5 w-5" />
                  {t('download.copyLink')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center flex-col items-center pt-0 pb-6">
          <p className="text-sm text-muted-foreground mt-4">
            {t('download.supportMessage')}
          </p>
          <a href={PATHS.CONTACT} className="text-sm text-primary hover:underline mt-1">
            {t('download.contactSupport')}
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}