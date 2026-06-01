import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ShieldCheck, Users, Eye, Crown, AlertCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

interface UserRow {
  user_id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  is_pro: boolean | null;
  plan_type: string | null;
  views: number | null;
  created_at: string;
  has_portfolio: boolean;
}

export default function Admin() {
  const { user, initializing } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Verify admin role
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (error) console.error('[admin] role check failed:', error);
      setIsAdmin(!!data);
    })();
  }, [user]);

  // Load user summary
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('admin_user_summary' as any);
      if (error) {
        toast.error('Failed to load users', { description: error.message });
        setLoading(false);
        return;
      }
      setUsers((data as UserRow[]) || []);
      setLoading(false);
    })();
  }, [isAdmin]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access denied</h1>
        <p className="text-muted-foreground">You don't have permission to view this page.</p>
      </div>
    );
  }

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: users.length,
    pro: users.filter((u) => u.is_pro).length,
    published: users.filter((u) => u.has_portfolio).length,
    totalViews: users.reduce((sum, u) => sum + (u.views || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet><title>Admin — Foliogen</title></Helmet>

      <header className="border-b border-border bg-card/40 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold">Admin Console</h1>
              <p className="text-xs text-muted-foreground">Signed in as {user.email}</p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/40 text-primary">
            <Crown className="h-3 w-3 mr-1" /> Admin
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total users" value={stats.total} icon={Users} />
          <StatCard label="Pro users" value={stats.pro} icon={Crown} />
          <StatCard label="Published" value={stats.published} icon={ShieldCheck} />
          <StatCard label="Total views" value={stats.totalViews} icon={Eye} />
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="errors">Recent errors</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base">All users ({filtered.length})</CardTitle>
                <div className="relative w-72 max-w-full">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by email, name, or username…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Portfolio</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((u) => (
                          <TableRow key={u.user_id}>
                            <TableCell>
                              <div className="font-medium">{u.full_name || '—'}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </TableCell>
                            <TableCell className="text-sm">{u.username || '—'}</TableCell>
                            <TableCell>
                              {u.is_pro ? (
                                <Badge className="bg-primary/15 text-primary border-primary/30">Pro</Badge>
                              ) : (
                                <Badge variant="outline">Free</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{u.views ?? 0}</TableCell>
                            <TableCell>
                              {u.has_portfolio ? (
                                <Badge variant="outline" className="border-emerald-500/40 text-emerald-500">Live</Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(u.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {u.username && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(`/u/${u.username}`, '_blank')}
                                >
                                  View
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {filtered.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              No users match your search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent errors</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Live error logs are surfaced through your backend's Edge Function logs and Postgres
                  logs. From this admin panel you can monitor user activity; for raw log streams open
                  the Lovable Cloud backend view.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      'https://supabase.com/dashboard/project/abcrgpmwoqsfwtmliqwo/logs/edge-functions',
                      '_blank',
                    )
                  }
                >
                  Open backend logs
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
