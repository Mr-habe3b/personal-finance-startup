

"use client";

import {
    Calculator,
    ChevronLeft,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';

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

    const renderLink = (item: typeof menuItems[0]) => (
        <Link
            key={item.href}
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "text-primary bg-muted",
                isCollapsed && "justify-center"
            )}
        >
            <item.icon className="h-5 w-5" />
            <span className={cn("truncate", isCollapsed && "hidden")}>{item.label}</span>
        </Link>
    );

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className={cn(
                    "flex h-16 items-center border-b transition-all",
                    isCollapsed ? "px-2 justify-center" : "px-4 lg:px-6"
                    )}>
                    <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                        <PieChart className="h-6 w-6" />
                        <span className={cn(isCollapsed && "hidden")}>EquityVision</span>
                    </Link>
                </div>
                <TooltipProvider delayDuration={0}>
                    <div className="flex-1 overflow-y-auto">
                        <nav className={cn(
                            "grid items-start text-sm font-medium",
                             isCollapsed ? "px-2" : "px-2 lg:px-4"
                        )}>
                            {menuItems.map((item) => (
                                isCollapsed ? (
                                    <Tooltip key={item.href}>
                                        <TooltipTrigger asChild>
                                            {renderLink(item)}
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>{item.label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    renderLink(item)
                                )
                            ))}
                        </nav>
                    </div>
                </TooltipProvider>
                <div className="mt-auto p-4 border-t">
                     <nav className={cn(
                            "grid items-start text-sm font-medium",
                             isCollapsed ? "px-0" : "px-2 lg:px-4"
                        )}>
                         {isCollapsed ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                    {renderLink(settingsItem)}
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>{settingsItem.label}</p>
                                </TooltipContent>
                            </Tooltip>
                         ) : (
                            renderLink(settingsItem)
                         )}
                     </nav>
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-full mt-4" 
                        onClick={toggleSidebar}
                      >
                        <ChevronLeft className={cn("h-6 w-6 transition-transform", isCollapsed && "rotate-180")} />
                     </Button>
                </div>
            </div>
        </div>
    );
}
