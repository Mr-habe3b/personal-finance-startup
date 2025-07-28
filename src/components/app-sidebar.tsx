
"use client";

import {
    Calculator,
    ChevronLeft,
    ChevronRight,
    Contact,
    FileText,
    Landmark,
    LayoutDashboard,
    Library,
    PieChart,
    Settings,
    Sparkles,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/clients', label: 'Clients', icon: Contact },
    { href: '/captable', label: 'Cap Table', icon: PieChart },
    { href: '/fundraising', label: 'Fundraising', icon: Landmark },
    { href: '/financials', label: 'Financials', icon: TrendingUp },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/milestones', label: 'Milestones', icon: Target },
    { href: '/wiki', label: 'Wiki', icon: Library },
];

const aiMenuItems = [
    { href: '/dilution-simulator', label: 'Simulator', icon: Calculator },
]

const settingsItem = { href: '/settings', label: 'Settings', icon: Settings };

interface AppSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    isMobile: boolean;
    isMobileSidebarOpen?: boolean;
    setIsMobileSidebarOpen?: (open: boolean) => void;
}

export function AppSidebar({ isCollapsed, toggleSidebar, isMobile, isMobileSidebarOpen, setIsMobileSidebarOpen }: AppSidebarProps) {
    const pathname = usePathname();

    const renderLink = (item: typeof menuItems[0], isCollapsed: boolean, isMobileLink: boolean = false) => {
        const linkContent = (
             <Link
                href={item.href}
                onClick={isMobileLink && setIsMobileSidebarOpen ? () => setIsMobileSidebarOpen(false) : undefined}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.href && "text-primary bg-muted",
                    isCollapsed && !isMobileLink && "justify-center"
                )}
            >
                <item.icon className="h-5 w-5" />
                <span className={cn("truncate", isCollapsed && !isMobileLink && "sr-only")}>{item.label}</span>
            </Link>
        );

        if (isCollapsed && !isMobileLink) {
            return (
                 <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                        {linkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{item.label}</p>
                    </TooltipContent>
                </Tooltip>
            );
        }
        return <div key={item.href}>{linkContent}</div>;
    };
    
    const SidebarContent = ({isMobileLink = false}: {isMobileLink?: boolean}) => (
        <TooltipProvider>
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-16 items-center border-b px-4 lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                        <PieChart className="h-6 w-6" />
                         <span className={cn("truncate", isCollapsed && !isMobileLink && "sr-only")}>Zynoit</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className={cn("grid items-start text-sm font-medium", isCollapsed && !isMobileLink ? "px-2" : "px-2 lg:px-4")}>
                        {menuItems.map(item => renderLink(item, isCollapsed, isMobileLink))}
                    </nav>
                    <div className={cn("my-4", isCollapsed && !isMobileLink ? "px-2" : "px-2 lg:px-4")}>
                        <h3 className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider", isCollapsed && !isMobileLink && "text-center")}>
                           {isCollapsed && !isMobileLink ? <Sparkles className="h-5 w-5 mx-auto" /> : "AI Tools"}
                        </h3>
                    </div>
                     <nav className={cn("grid items-start text-sm font-medium", isCollapsed && !isMobileLink ? "px-2" : "px-2 lg:px-4")}>
                        {aiMenuItems.map(item => renderLink(item, isCollapsed, isMobileLink))}
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t">
                    <div className='mb-4'>
                         <nav className={cn("grid items-start text-sm font-medium", isCollapsed && !isMobileLink ? "px-0" : "px-2 lg:px-4")}>
                            {renderLink(settingsItem, isCollapsed, isMobileLink)}
                        </nav>
                    </div>
                     {!isMobile && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-full flex justify-center"
                            onClick={toggleSidebar}
                        >
                            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );

    if (isMobile) {
        return (
             <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetContent side="left" className="p-0 w-3/4">
                     <SheetHeader>
                        <SheetTitle className="sr-only">Main Menu</SheetTitle>
                    </SheetHeader>
                    <SidebarContent isMobileLink={true} />
                </SheetContent>
            </Sheet>
        );
    }


    return (
        <div className={cn("hidden border-r bg-muted/40 md:fixed md:inset-y-0 md:left-0 md:z-10 md:flex md:flex-col transition-all duration-300 ease-in-out", isCollapsed ? "w-14" : "w-[220px] lg:w-[280px]")}>
            <SidebarContent />
        </div>
    );
}
