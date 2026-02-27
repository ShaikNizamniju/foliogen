import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Palette, 
  Settings, 
  LogOut,
  Sparkles,
  Briefcase,
  FolderOpen,
  ChevronLeft,
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
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const menuItems = [
  { title: 'Overview', icon: LayoutDashboard, section: 'overview' },
  { title: 'Profile', icon: User, section: 'profile' },
  { title: 'Job Match', icon: Sparkles, section: 'job-match' },
  { title: 'Projects', icon: FolderOpen, section: 'jobs' },
  { title: 'Templates', icon: Palette, section: 'templates' },
  { title: 'Settings', icon: Settings, section: 'settings' },
];

export function DashboardSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const currentSection = new URLSearchParams(location.search).get('section') || 'overview';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-5">
        <Link to="/" className="flex items-center gap-3">
          <motion.div 
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-foreground"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </motion.div>
          {!collapsed && (
            <motion.span 
              className="font-semibold text-lg text-sidebar-foreground tracking-tight"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              FolioGen
            </motion.span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          {!collapsed && (
            <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-widest text-sidebar-foreground/40">
              Navigation
            </p>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = currentSection === item.section;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "relative rounded-xl h-10 transition-all duration-200",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      )}
                    >
                      <Link 
                        to={`/dashboard?section=${item.section}`}
                        data-tour={item.section === 'profile' ? 'profile' : undefined}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 rounded-xl bg-sidebar-accent"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground" />
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="flex-1 justify-start text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-xl"
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
