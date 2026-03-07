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
  Target,
  MessageSquareText,
  ChevronLeft,
} from 'lucide-react';
import logoImg from '@/assets/logo.png';
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
  { title: 'Career Hub', icon: Briefcase, section: 'jobs' },
  { title: 'Interview Prep', icon: Target, section: 'interview-prep' },
  { title: 'Templates', icon: Palette, section: 'templates' },
  { title: 'Chat Log', icon: MessageSquareText, section: 'chat-log' },
  { title: 'Settings', icon: Settings, section: 'settings' },
];

export function DashboardSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const currentSection = new URLSearchParams(location.search).get('section') || 'jobs';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl overflow-hidden"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <img src={logoImg} alt="Foliogen" className="h-8 w-8 object-contain" />
          </motion.div>
          {!collapsed && (
            <motion.span
              className="font-semibold text-lg text-sidebar-foreground tracking-tight"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Foliogen
            </motion.span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          {!collapsed && (
            <p className="px-2 mb-2 text-[11px] font-medium uppercase tracking-widest text-sidebar-foreground/40">
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
                        <span className="relative z-10 flex items-center gap-2">
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
