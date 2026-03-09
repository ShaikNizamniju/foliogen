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

  const currentSection = location.pathname === '/profile'
    ? 'profile'
    : (new URLSearchParams(location.search).get('section') || 'overview');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className={cn("p-4", collapsed && "flex items-center justify-center p-2")}>
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            className={cn("flex shrink-0 items-center justify-center rounded-xl overflow-hidden", collapsed ? "h-10 w-10 border border-border" : "h-8 w-8")}
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <img src={logoImg} alt="Foliogen" className="h-full w-full object-contain mix-blend-multiply" />
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
                        "relative rounded-xl h-10 transition-all duration-200 bg-transparent hover:bg-transparent"
                      )}
                    >
                      <Link
                        to={item.section === 'profile' ? '/profile' : `/dashboard?section=${item.section}`}
                        data-tour={item.section === 'profile' ? 'profile' : undefined}
                        className={cn(
                          "flex flex-1 items-center gap-2",
                          collapsed && "justify-center",
                          "transition-all duration-200 ease-in-out hover:bg-primary/5 rounded-xl h-full w-full",
                          isActive ? "text-[hsl(239,84%,67%)] font-medium" : "text-sidebar-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-border"
                            className="absolute left-0 top-[10%] bottom-[10%] w-[3px] bg-[hsl(239,84%,67%)] rounded-r-md"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center pl-2">
                          <item.icon className={cn("h-4 w-4", collapsed && "scale-110", isActive && "text-[hsl(239,84%,67%)]")} />
                          {!collapsed && <span className="ml-2">{item.title}</span>}
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

      <SidebarFooter className={cn("p-4 border-t border-sidebar-border", collapsed && "flex-col items-center gap-4 px-2")}>
        {!collapsed ? (
          <div className="flex items-center gap-2 w-full">
            <SidebarTrigger className="h-8 w-8 shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex-1 justify-start text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-xl"
            >
              <LogOut className="h-4 w-4 mr-2 shrink-0" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <SidebarTrigger className="h-8 w-8 mx-auto text-sidebar-foreground/60 hover:text-sidebar-foreground flex items-center justify-center shrink-0" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-10 w-10 mx-auto text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <div className="h-10 w-10 overflow-hidden rounded-full border border-border mt-1">
              <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary font-bold">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
