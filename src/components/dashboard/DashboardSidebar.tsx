import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider';
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
  ChevronRight,
  ArrowLeftRight,
  Vault,
  Sun,
  Moon,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';
import logoImg from '@/assets/logo.png';
import profilePhoto from '@/assets/profile-photo.jpeg';
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
  { title: 'Identity Vault', icon: Vault, section: 'identity-vault' },
  { title: 'Billing & Subscription', icon: CreditCard, section: 'billing' },
  { title: 'Chat Log', icon: MessageSquareText, section: 'chat-log' },
  { title: 'Settings', icon: Settings, section: 'settings' },
];

export function DashboardSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { state, setOpen, isMobile, isMobileCollapsed, setIsMobileCollapsed } = useSidebar();
  const collapsed = isMobile ? isMobileCollapsed : state === 'collapsed';

  const [searchParams] = useSearchParams();
  const currentSection = searchParams.get('section') || 'overview';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar dark:bg-sidebar transition-colors duration-300 ease-in-out">
      <SidebarHeader className={cn("p-0 flex flex-col", !collapsed && "gap-0")}>
        {/* Mobile: Dark high-contrast toggle bar */}
        {isMobile && (
          <button
            onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
            className="flex items-center justify-center w-full h-12 bg-sidebar-foreground/10 hover:bg-sidebar-foreground/15 border-b border-sidebar-border transition-colors duration-200"
          >
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </button>
        )}
        {/* Logo row */}
        <div className={cn("flex items-center p-4", collapsed && "justify-center p-3")}>
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <motion.div
              className={cn("flex shrink-0 items-center justify-center rounded-xl overflow-hidden", collapsed ? "h-9 w-9" : "h-8 w-8")}
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <img src={logoImg} alt="Foliogen" className="h-full w-full object-contain mix-blend-multiply" />
            </motion.div>
            <span
              className={cn(
                "font-semibold text-lg text-sidebar-foreground tracking-tight whitespace-nowrap transition-all duration-300 ease-in-out flex items-center gap-2",
                collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}
            >
              Foliogen
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
                Beta
              </span>
            </span>
          </Link>
          {/* Desktop: ChevronLeft toggle */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!collapsed)}
              className={cn("h-7 w-7 ml-auto text-sidebar-foreground/60 transition-transform duration-300", collapsed && "rotate-180")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
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
                        to={`/dashboard?section=${item.section}`}
                        data-tour={item.section === 'profile' ? 'profile' : undefined}
                        className={cn(
                          "flex flex-1 items-center gap-2",
                          collapsed && "justify-center",
                          "transition-all duration-200 ease-in-out hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl h-full w-full",
                          isActive ? "text-zinc-950 dark:text-zinc-50 font-medium" : "text-zinc-600 dark:text-zinc-400"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-border"
                            className="absolute left-0 top-[10%] bottom-[10%] w-[3px] bg-primary rounded-r-md"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        <span className={cn(
                          "relative z-10 flex items-center transition-all duration-300 ease-in-out",
                          collapsed ? "justify-center w-full" : "pl-2"
                        )}>
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              animate={isActive ? { scale: [1, 1.03, 1] } : {}}
                              transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { type: 'spring', stiffness: 400, damping: 10 }}
                              style={{ willChange: "transform" }}
                              className="flex items-center justify-center relative"
                            >
                              <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", collapsed && "scale-110", isActive && "text-[#00E5FF]")} />
                            </motion.div>
                          <span
                            className={cn(
                              "ml-2 whitespace-nowrap transition-all duration-300 ease-in-out",
                              collapsed ? "opacity-0 w-0 overflow-hidden ml-0" : "opacity-100"
                            )}
                          >
                            {item.title}
                          </span>
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

      <SidebarFooter className={cn("p-4 border-t border-sidebar-border transition-all duration-300", collapsed && "flex-col items-center gap-4 px-2")}>
        {!collapsed ? (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-2 px-2 pb-2 border-b border-sidebar-border/50">
              <span className="text-[11px] font-medium text-sidebar-foreground/50">Support: </span>
              <a href="mailto:admin@foliogen.in" className="text-[11px] font-semibold text-primary hover:underline truncate">
                admin@foliogen.in
              </a>
            </div>
            <div className="flex items-center gap-2 w-full pt-1">
              {/* Desktop handles sidebar toggles with SidebarTrigger normally */}
              {!isMobile && <SidebarTrigger className="h-8 w-8 shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground" />}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex-1 justify-start text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl px-2 focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                >
                  <LogOut className="h-4 w-4 mr-2 shrink-0" />
                  Sign Out
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-9 w-9 shrink-0 min-w-[48px] min-h-[48px] text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <SidebarTrigger className="h-8 w-8 mx-auto text-sidebar-foreground/60 hover:text-sidebar-foreground flex items-center justify-center shrink-0" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-10 w-10 min-w-[48px] min-h-[48px] mx-auto text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl shrink-0 focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-10 w-10 min-w-[48px] min-h-[48px] mx-auto text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl shrink-0 focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#00E5FF]/20 mt-1">
              <img src={profilePhoto} alt="Shaik Nizamuddin" className="h-full w-full object-cover" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
