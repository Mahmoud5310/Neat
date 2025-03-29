import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Redirect } from 'wouter';
import { BarChart, LineChart, PieChart, AreaChart } from '@/components/ui/chart';
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Users, 
  Clock,
  Activity,
  ArrowUpRight,
  MousePointerClick,
  Download,
  ShoppingCart 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  // Check if user is admin (assuming id=1 is the admin)
  // In Firebase auth, we need to check the user's email or custom claims
  const isAdmin = user && user.email === 'admin@example.com'; // Simple admin check based on email

  // If not admin, redirect to home
  if (!user || !isAdmin) {
    return <Redirect to="/" />;
  }

  // Fetch page views statistics
  const pageViewsQuery = useQuery<{page: string, count: number}[]>({
    queryKey: ['/api/analytics/page-views'],
    enabled: !!user && isAdmin,
    placeholderData: [] // Provide an empty array as placeholder data
  });

  // Fetch event types statistics
  const eventsQuery = useQuery<any[]>({
    queryKey: ['/api/analytics/events/page_view'],
    enabled: !!user && isAdmin,
    placeholderData: [] // Provide an empty array as placeholder data
  });

  // Fetch recent analytics
  const recentAnalyticsQuery = useQuery<any[]>({
    queryKey: ['/api/analytics/recent'],
    enabled: !!user && isAdmin,
    placeholderData: [] // Provide an empty array as placeholder data
  });

  // Format data for charts
  const pageViewsData = React.useMemo(() => {
    if (!pageViewsQuery.data) return { 
      data: [], 
      categories: [] 
    };

    const sortedData = [...pageViewsQuery.data]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      data: sortedData.map(item => item.count),
      categories: sortedData.map(item => item.page)
    };
  }, [pageViewsQuery.data]);

  const eventTypeData = React.useMemo(() => {
    // For this demo, create mock event type distribution
    return {
      data: [
        { name: 'Page Views', value: 65 },
        { name: 'Clicks', value: 20 },
        { name: 'Purchases', value: 5 },
        { name: 'Downloads', value: 10 }
      ]
    };
  }, []);

  const dailyVisitors = React.useMemo(() => {
    // For the demo, create mock daily visitor data
    const days = [];
    const data = [];
    
    // Generate last 7/30/90 days based on timeRange
    const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const today = new Date();
    
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Random value between 20 and 200 for demo
      const randomVisitors = Math.floor(Math.random() * 180) + 20;
      data.push(randomVisitors);
    }
    
    return { days, data };
  }, [timeRange]);

  // Loading state
  if (pageViewsQuery.isLoading || eventsQuery.isLoading || recentAnalyticsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (pageViewsQuery.error || eventsQuery.error || recentAnalyticsQuery.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>
            {t('analytics.loadError')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('analytics.dashboardTitle')}</h1>
        <Select 
          value={timeRange} 
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('analytics.timeRange')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">{t('analytics.last7Days')}</SelectItem>
            <SelectItem value="30d">{t('analytics.last30Days')}</SelectItem>
            <SelectItem value="90d">{t('analytics.last90Days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.totalPageViews')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pageViewsQuery.data ? pageViewsQuery.data.reduce((sum, item) => sum + item.count, 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +{Math.floor(Math.random() * 15) + 5}% {t('analytics.fromPrevious')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.totalClicks')}
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(Math.random() * 1000) + 500}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +{Math.floor(Math.random() * 10) + 3}% {t('analytics.fromPrevious')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.downloads')}
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(Math.random() * 100) + 50}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +{Math.floor(Math.random() * 20) + 10}% {t('analytics.fromPrevious')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.purchases')}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(Math.random() * 50) + 10}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +{Math.floor(Math.random() * 25) + 5}% {t('analytics.fromPrevious')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            {t('analytics.overview')}
          </TabsTrigger>
          <TabsTrigger value="pageViews">
            <BarChartIcon className="h-4 w-4 mr-2" />
            {t('analytics.pageViews')}
          </TabsTrigger>
          <TabsTrigger value="events">
            <PieChartIcon className="h-4 w-4 mr-2" />
            {t('analytics.eventDistribution')}
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChartIcon className="h-4 w-4 mr-2" />
            {t('analytics.trends')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.dailyVisitors')}</CardTitle>
                <CardDescription>{t('analytics.visitorsTrend')}</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={dailyVisitors.data}
                  categories={dailyVisitors.days}
                  index='date'
                  colors={['blue']}
                  className="h-80"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.eventDistribution')}</CardTitle>
                <CardDescription>{t('analytics.eventDistributionDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={eventTypeData.data}
                  index='name'
                  valueKey='value'
                  className="h-80"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pageViews">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.topPages')}</CardTitle>
              <CardDescription>{t('analytics.topPagesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={pageViewsData.data}
                categories={pageViewsData.categories}
                index='page'
                className="h-96"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.eventBreakdown')}</CardTitle>
              <CardDescription>{t('analytics.eventBreakdownDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PieChart
                  data={eventTypeData.data}
                  index='name'
                  valueKey='value'
                  className="h-80"
                />
                <div className="space-y-4">
                  {eventTypeData.data.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 bg-${['blue', 'green', 'yellow', 'red'][index]}-500`}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.userActivity')}</CardTitle>
              <CardDescription>{t('analytics.userActivityDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={dailyVisitors.data}
                categories={dailyVisitors.days}
                index='date'
                colors={['indigo']}
                className="h-96"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('analytics.recentActivity')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription>{t('analytics.recentActivityDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalyticsQuery.data && recentAnalyticsQuery.data.length > 0 ? (
              recentAnalyticsQuery.data.slice(0, 10).map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">
                      {item.event === 'page_view' ? t('analytics.viewedPage') : 
                       item.event === 'click' ? t('analytics.clickedElement') :
                       item.event === 'purchase' ? t('analytics.madePurchase') :
                       item.event === 'download' ? t('analytics.downloadedProject') :
                       item.event}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.page}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">User ID: {item.userId}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>{t('analytics.noRecentActivity')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}