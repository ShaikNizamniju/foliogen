import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Palette, 
  Settings, 
  LogOut,
  Sparkles,
  Briefcase,
  BarChart3,
  Search,
  FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
  { title: 'Portfolio Builder', icon: LayoutDashboard, path: '/dashboard', section: null },
  { title: 'Analytics', icon: BarChart3, path: '/dashboard', section: 'analytics' },
  { title: 'Blog', icon: FileText, path: '/dashboard', section: 'blog' },
  { title: 'SEO', icon: Search, path: '/dashboard', section: 'seo' },
  { title: 'Job Match', icon: Briefcase, path: '/dashboard', section: 'job-match' },
  { title: 'Templates', icon: Palette, path: '/dashboard', section: 'templates' },
  { title: 'Settings', icon: Settings, path: '/dashboard', section: 'settings' },
];

export function DashboardSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const currentSection = new URLSearchParams(location.search).get('section');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get user avatar and initials from metadata
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split('@')[0];
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-semibold text-sidebar-foreground">FolioGen</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = item.section === null 
                  ? !currentSection 
                  : currentSection === item.section;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link 
                        to={item.section ? `${item.path}?section=${item.section}` : item.path}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        {/* User Badge */}
        {!collapsed && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{userEmail}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <Avatar className="h-8 w-8 mx-auto">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-8 w-8" />
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="flex-1 justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
