import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Eye, Globe, Monitor, Smartphone, TrendingUp, Users, Calendar } from 'lucide-react';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';

interface AnalyticsEvent {
  id: string;
  event_type: string;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  page_path: string | null;
  created_at: string;
}

interface DailyViews {
  date: string;
  views: number;
}

interface ReferrerData {
  name: string;
  value: number;
}

interface DeviceData {
  name: string;
  value: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function AnalyticsSection() {
  const { user } = useAuth();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = subDays(new Date(), daysAgo).toISOString();

    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('profile_user_id', user.id)
      .gte('created_at', startDate)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  // Calculate daily views
  const getDailyViews = (): DailyViews[] => {
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const days = eachDayOfInterval({
      start: subDays(new Date(), daysAgo - 1),
      end: new Date()
    });

    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const viewsOnDay = events.filter(e => {
        const eventDate = new Date(e.created_at);
        return eventDate >= dayStart && eventDate < dayEnd;
      }).length;

      return {
        date: format(day, 'MMM d'),
        views: viewsOnDay
      };
    });
  };

  // Calculate referrer breakdown
  const getReferrerData = (): ReferrerData[] => {
    const referrerCounts: Record<string, number> = {};
    
    events.forEach(e => {
      const referrer = e.referrer || 'Direct';
      let source = 'Direct';
      
      if (referrer !== 'Direct') {
        try {
          const url = new URL(referrer);
          source = url.hostname.replace('www.', '');
        } catch {
          source = referrer;
        }
      }
      
      referrerCounts[source] = (referrerCounts[source] || 0) + 1;
    });

    return Object.entries(referrerCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // Calculate device breakdown
  const getDeviceData = (): DeviceData[] => {
    const deviceCounts: Record<string, number> = {};
    
    events.forEach(e => {
      const device = e.device_type || 'Unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    return Object.entries(deviceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const totalViews = events.length;
  const uniqueCountries = new Set(events.map(e => e.country).filter(Boolean)).size;
  const dailyViews = getDailyViews();
  const referrerData = getReferrerData();
  const deviceData = getDeviceData();

  // Calculate trend (compare to previous period)
  const midPoint = Math.floor(dailyViews.length / 2);
  const recentViews = dailyViews.slice(midPoint).reduce((sum, d) => sum + d.views, 0);
  const previousViews = dailyViews.slice(0, midPoint).reduce((sum, d) => sum + d.views, 0);
  const trendPercentage = previousViews > 0 ? Math.round(((recentViews - previousViews) / previousViews) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Track how your portfolio is performing.
        </p>
      </div>

      {/* Time Range Selector */}
      <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
        <TabsList>
          <TabsTrigger value="7d">Last 7 days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 days</TabsTrigger>
          <TabsTrigger value="90d">Last 90 days</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">{totalViews}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trend</p>
              <p className={`text-2xl font-bold ${trendPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trendPercentage >= 0 ? '+' : ''}{trendPercentage}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Countries</p>
              <p className="text-2xl font-bold">{uniqueCountries}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg/Day</p>
              <p className="text-2xl font-bold">
                {dailyViews.length > 0 ? Math.round(totalViews / dailyViews.length) : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Views Over Time Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Views Over Time
        </h3>
        <div className="h-[300px]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : dailyViews.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyViews}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data yet. Share your portfolio to start tracking views!
            </div>
          )}
        </div>
      </Card>

      {/* Referrers & Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Traffic Sources
          </h3>
          <div className="h-[200px]">
            {referrerData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referrerData} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No referrer data yet
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Devices
          </h3>
          <div className="h-[200px]">
            {deviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No device data yet
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
