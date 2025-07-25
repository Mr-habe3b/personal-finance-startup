

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
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/clients', label: 'Clients', icon: Contact },
    { href: '/captable', label: 'Cap Table', icon: PieChart },
    { href: '/fundraising', label: 'Fundraising', icon: Landmark },
    { href: '/financials', label: 'Financials', icon: TrendingUp },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/dilution-simulator', label: 'Simulator', icon: Calculator },
    { href: '/milestones', label: 'Milestones', icon: Target },
    { href: '/wiki', label: 'Wiki', icon: Library },
];

const settingsItem = { href: '/settings', label: 'Settings', icon: Settings };

interface AppSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export function AppSidebar({ isCollapsed, toggleSidebar }: AppSidebarProps) {
    const pathname = usePathname();

    const renderLink = (item: typeof menuItems[0], isCollapsed: boolean) => {
        const linkContent = (
             <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.href && "text-primary bg-muted",
                    isCollapsed && "justify-center"
                )}
            >
                <item.icon className="h-5 w-5" />
                <span className={cn("truncate", isCollapsed && "sr-only")}>{item.label}</span>
            </Link>
        );

        if (isCollapsed) {
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

    return (
        <div className={cn("hidden border-r bg-muted/40 md:fixed md:inset-y-0 md:left-0 md:z-10 md:flex md:flex-col transition-all duration-300 ease-in-out", isCollapsed ? "w-[72px]" : "w-[220px] lg:w-[280px]")}>
            <TooltipProvider>
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-16 items-center border-b px-4 lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                            <PieChart className="h-6 w-6" />
                            <span className={cn("truncate", isCollapsed && "sr-only")}>EquityVision</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <nav className={cn("grid items-start text-sm font-medium", isCollapsed ? "px-2" : "px-2 lg:px-4")}>
                            {menuItems.map(item => renderLink(item, isCollapsed))}
                        </nav>
                    </div>
                    <div className="mt-auto p-4 border-t">
                        <div className='mb-4'>
                             <nav className={cn("grid items-start text-sm font-medium", isCollapsed ? "px-0" : "px-2 lg:px-4")}>
                                {renderLink(settingsItem, isCollapsed)}
                            </nav>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-full flex justify-center"
                            onClick={toggleSidebar}
                        >
                            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>
                    </div>
                </div>
            </TooltipProvider>
        </div>
    );
}
