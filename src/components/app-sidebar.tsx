"use client";

import {
    Calculator,
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

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/captable', label: 'Cap Table', icon: PieChart },
    { href: '/fundraising', label: 'Fundraising', icon: Landmark },
    { href: '/financials', label: 'Financials', icon: TrendingUp },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/dilution-simulator', label: 'Simulator', icon: Calculator },
    { href: '/milestones', label: 'Milestones', icon: Target },
    { href: '/wiki', label: 'Wiki', icon: Library },
];

const settingsItem = { href: '/settings', label: 'Settings', icon: Settings };

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-16 items-center border-b px-4 lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                        <PieChart className="h-6 w-6" />
                        <span>EquityVision</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                    pathname === item.href && "text-primary bg-muted"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                     <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                         <Link
                            href={settingsItem.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname === settingsItem.href && "text-primary bg-muted"
                            )}
                        >
                            <settingsItem.icon className="h-4 w-4" />
                            {settingsItem.label}
                        </Link>
                     </nav>
                </div>
            </div>
        </div>
    );
}
